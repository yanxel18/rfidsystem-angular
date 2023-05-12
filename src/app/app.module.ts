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

  const middleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${localStorage.getItem('AuthNoket') || null}`
      ),
    });
    return forward(operation);
  });
  const Mainlink = middleware.concat(httpLink);
  const errorlink = (): ApolloLink => {
    return onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message }) => { 
          errorMSG(message);
          return forward(operation);
        });
      if (networkError) {
        errorMSG(networkError.message);
        return forward(operation);
      }
      return forward(operation);
    });
  };
  const errorMSG = (msg: string): void => {
    const m = msg.includes('failure')
      ? 'サーバー接続問題が発生しました！'
      : msg;
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
    CAreapieGraphComponent
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
    NgxTrimDirectiveModule
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
                  },PerAreaGraph: {
                    merge(_, incoming) {
                      return incoming;
                    },
                  },
                },
              },
            },
            addTypename: false
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
    {provide: APP_BASE_HREF, useValue:'/rfid/'}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
