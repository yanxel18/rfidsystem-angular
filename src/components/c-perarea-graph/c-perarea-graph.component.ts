import { Component, Input, OnChanges } from '@angular/core';
import { IPerAreaGraph } from 'src/models/viewboard-model';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  MarkLineComponent,
} from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
@Component({
  selector: 'app-c-perarea-graph',
  templateUrl: './c-perarea-graph.component.html',
  styleUrls: ['./c-perarea-graph.component.sass'],
})
export class CPerareaGraphComponent implements OnChanges {
  @Input() rawData!: IPerAreaGraph[] | null;
  ngOnChanges(): void {
    echarts.use([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      LineChart,
      CanvasRenderer,
      UniversalTransition,
      MarkLineComponent,
    ]);

    type EChartsOption = echarts.ComposeOption<
      | TitleComponentOption
      | ToolboxComponentOption
      | TooltipComponentOption
      | GridComponentOption
      | LineSeriesOption
    >;

    const chartDom = document.getElementById('main');
    if (chartDom) {
      //echarts.dispose(chartDom);
      const myChart = echarts.init(chartDom);
      myChart.clear();
      window.addEventListener('resize', function () {
        if (chartDom) myChart.resize();
      });
      myChart.resize({
        width: 'auto',
      });
      const option: EChartsOption = {
        tooltip: {
          trigger: 'axis',
          formatter: '時間: {b}<br/> {a}: <b>{c}</b>%',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        grid: {
          top: '10px',
          left: '40px',
          right: '40px',
          bottom: '5px',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.rawData
            ? this.rawData.map((data) => {
                return data.x;
              })
            : [],
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}%',
          },
          min: 0,
          max: 100,
          type: 'value',
        },
        series: [
          {
            name: '在室率',
            type: 'line',
            smooth: true,
            stack: 'Total',
            data: this.rawData
              ? this.rawData.map((data) => {
                  return data.y;
                })
              : [],
            markLine: {
              silent: true,
              lineStyle: {
                color: '#ff0000',
                width: 3,
              },
              data: [
                {
                  yAxis: 80,
                },
              ],
            },
          },
        ],
      };

      option && myChart.setOption(option, true);
    }
  }
}
