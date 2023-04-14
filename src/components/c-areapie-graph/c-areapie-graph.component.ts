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
import { Observable, Subscription } from 'rxjs';
import { IPerAreaTotalStatistics } from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-areapie-graph',
  templateUrl: './c-areapie-graph.component.html',
  styleUrls: ['./c-areapie-graph.component.sass'],
})
export class CAreapieGraphComponent implements OnChanges, OnInit, OnDestroy {
  @Input() DataSource!: Observable<IPerAreaTotalStatistics | null>;
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initializePieChart();
  }
  initializePieChart(): void {
    this.subscriptions.push(
      this.DataSource.subscribe((data) => {
        if (data?.TotalArea) {
          const newTotalAreaData = data.TotalArea.map((AreaData) => {
            return [
              {
                value: AreaData.total,
                name: '出社人数',
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

          const chartDom = document.getElementById('main')!;
          const myChart = echarts.init(chartDom);

          myChart.clear();
          window.addEventListener('resize', function () {
            myChart.resize();
          });
          myChart.resize({
            width: 'auto',
          });
          const option: EChartsOption = {
            title: {
              text: '在室率',
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
            },
            legend: {
              top: '5%',
              left: 'center',
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
                  focus: 'self',
                },
                label: {
                  show: false,
                  position: 'center',
                },
                labelLine: {
                  show: false,
                },
                data: newTotalAreaData[0],
              },
            ],
          };

          option && myChart.setOption(option);
        }
      })
    );
  }
  ngOnChanges(): void {
    this.initializePieChart();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
