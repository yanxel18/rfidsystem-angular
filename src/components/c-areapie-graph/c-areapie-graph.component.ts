import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
  TitleComponent,
  TitleComponentOption,
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Subscription } from 'rxjs';
import { ITotalArea } from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-areapie-graph',
  templateUrl: './c-areapie-graph.component.html',
  styleUrls: ['./c-areapie-graph.component.sass'],
})
export class CAreapieGraphComponent implements OnChanges, OnInit, OnDestroy {
  @Input() DataSource!: ITotalArea[] | null;
  subscriptions: Subscription[] = [];
 
  ngOnInit(): void {

    this.initializePieChart();
  }
  initializePieChart(): void {
        if (this.DataSource) {
          const newTotalAreaData = this.DataSource?.map((AreaData) => {
            return [
              {
                value: AreaData.total - AreaData.workerIn,
                name: '外室人数',
              },
              {
                value: AreaData.workerIn,
                name: '在室人数',
              },
            ];
          });

          echarts.use([
            TooltipComponent,
            LegendComponent,
            PieChart,
            CanvasRenderer,
            LabelLayout,
            TitleComponent,
          ]);

          type EChartsOption = echarts.ComposeOption<
            | TitleComponentOption
            | TooltipComponentOption
            | LegendComponentOption
            | PieSeriesOption
          >;
          
          const chartDom = document.getElementById('main');
          if (chartDom) {
          echarts.dispose(chartDom)
          const myChart = echarts.init(chartDom) 
          const option: EChartsOption = {
            title: {
              text: '在室率',
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 5,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }, 
                data: newTotalAreaData[0],
              },
            ],
          };

          option && myChart.setOption(option); 
        }
        }
  }
  ngOnChanges(): void {
    this.initializePieChart();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
