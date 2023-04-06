import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
  LegendComponent,
  LegendComponentOption,
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
export class CPerareaGraphComponent implements OnChanges, OnInit {
  @Input() rawData!: IPerAreaGraph[];

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {
    echarts.use([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
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
      | LegendComponentOption
      | LineSeriesOption
    >;

    const chartDom = document.getElementById('main')!;
    const myChart = echarts.init(chartDom);
    let option: EChartsOption;

    option = { 
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
        left: '30px',
        right: '30px',
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
        data: this.rawData.map((data) => {
          return data.x;
        }),
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
          data: this.rawData.map((data) => {
            return data.y;
          }),
          markLine: {
            silent: true,
            lineStyle: {
              color: '#ff0000',
              width: 3
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
    option && myChart.setOption(option,true);
  }
}
