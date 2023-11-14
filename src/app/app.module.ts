import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { onError } from '@apollo/client/link/error';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModules } from 'src/material-modules/material-module';
import { CViewBoardComponent } from '../components/c-view-board/c-view-board.component';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
import { environment } from 'src/environments/environment';
import { CBurgerComponent } from '../components/c-burger/c-burger.component';
import { CEmployeeCardComponent } from '../components/c-employee-card/c-employee-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CViewBoardNaviComponent } from '../components/c-view-board-navi/c-view-board-navi.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Swal from 'sweetalert2';
import { CDialogCommentComponent } from '../components/c-dialog/c-dialog-comment/c-dialog-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CScrolltopComponent } from '../components/c-scrolltop/c-scrolltop.component';
import { CPerareaGraphComponent } from '../components/c-perarea-graph/c-perarea-graph.component';
import { CMainDashboardComponent } from '../components/c-main-dashboard/c-main-dashboard.component';
import { CAreatotalTableComponent } from '../components/c-areatotal-table/c-areatotal-table.component';
import { CAreapieGraphComponent } from '../components/c-areapie-graph/c-areapie-graph.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { CNotFoundComponent } from 'src/components/c-404/c-notfound';
import { RouteReuseStrategy } from '@angular/router';
import { AppRouteReuseStrategy } from './app-routestrategy';
import { CViewBoardStatisticsComponent } from '../components/c-view-board-statistics/c-view-board-statistics.component';

/**
 * This message is triggered when callback  from websocket event is received
 */
const disconnectMsg = () => {
  const Toast = Swal.mixin({
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    icon: 'error',
    showClass: {
      backdrop: 'swal2-noanimation', // disable backdrop animation
      popup: '', // disable popup animation
      icon: '', // disable icon animation
    },
    hideClass: {
      popup: '', // disable popup fade-out animation
    },
  });
  Toast.fire({
    text: `サーバーに接続は切断されています。再接続しています。しばらくお待ちください。`,
    timerProgressBar: true,
    didOpen() {
      Toast.showLoading();
    },
  });
};
/**
 * This message will be trigger when connection is established
 * @param message success message received  parameter
 */
const successMsg = (message: string) => {
  const Toast = Swal.mixin({
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    timer: 3000,
    icon: 'success',
  });
  Toast.fire({
    text: `${message}`,
    timerProgressBar: true,
  });
};
/**
 * This message will be trigger when reconnected to the server
 * @param message received from reconnection
 */
const successMsgOnRecon = (message: string) => {
  const Toast = Swal.mixin({
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    timer: 2000,
    icon: 'success',
  });
  Toast.fire({
    text: `${message}`,
    timerProgressBar: true,
    didClose: () => {
      window.location.reload();
    },
  });
};
/**
 *
 * @param link  received httplink from graphql config
 * @returns  apollolink configuration
 */
const newHttpLink = (link: HttpLink): ApolloLink => {
  const uri = environment.gUrl;
  const wsLink = new SubscriptionClient(environment.ws, {
    reconnect: true,
  });
  const ws = new WebSocketLink(wsLink);
  wsLink.onConnected(() => successMsg('サーバーに接続済み。'));
  wsLink.onDisconnected(() => disconnectMsg());
  wsLink.onReconnected(() => successMsgOnRecon('サーバーに再接続済み。'));
  const httpLink = link.create({
    uri,
  });
  /**
   * Setting up middleware interceptor by getting the token from the storage
   */
  const middleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${localStorage.getItem('AuthNoket') ?? null}`
      ),
    });
    return forward(operation);
  });
  const Mainlink = middleware.concat(httpLink);
  const errorlink = (): ApolloLink => {
    return onError(({ graphQLErrors, operation, forward }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message }) => {
          errorMSG(message);
          return forward(operation);
        });
      return forward(operation);
    });
  };
  const errorMSG = (msg: string): void => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      showCloseButton: true,
      showConfirmButton: false,
      timer: 3000,
    });
    Toast.fire({
      icon: 'error',
      text: msg,
    });
  };
  const xlink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    ws,
    errorlink().concat(Mainlink)
  );

  return xlink;
};
registerLocaleData(localeJa);

@NgModule({
  declarations: [
    AppComponent,
    CViewBoardComponent,
    CBurgerComponent,
    CEmployeeCardComponent,
    CViewBoardNaviComponent,
    CDialogCommentComponent,
    CScrolltopComponent,
    CPerareaGraphComponent,
    CMainDashboardComponent,
    CAreatotalTableComponent,
    CAreapieGraphComponent,
    CNotFoundComponent,
    CViewBoardStatisticsComponent,
  ],
  imports: [
    MaterialModules,
    BrowserModule,
    AppRoutingModule,
    ApolloModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSkeletonLoaderModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTrimDirectiveModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(link: HttpLink) {
        return {
          cache: new InMemoryCache({
            typePolicies: {
              Query: {
                fields: {
                  EmployeeBoardAll: {
                    merge(_, incoming) {
                      return incoming;
                    },
                  },
                  PerAreaGraph: {
                    merge(_, incoming) {
                      return incoming;
                    },
                  },
                },
              },
            },
            addTypename: false,
          }),
          link: newHttpLink(link),
          defaultOptions: {
            watchQuery: {
              errorPolicy: 'all',
            },
          },
        };
      },
      deps: [HttpLink],
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    { provide: LOCALE_ID, useValue: 'ja-JP' },
    { provide: APP_BASE_HREF, useValue: '/rfid/' },
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
