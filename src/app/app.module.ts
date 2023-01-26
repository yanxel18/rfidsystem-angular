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
import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
import { environment } from 'src/environments/environment';
import { CBurgerComponent } from '../components/c-burger/c-burger.component';
import { CEmployeeCardComponent } from '../components/c-employee-card/c-employee-card.component';
const newHttpLink = (link: HttpLink): ApolloLink => {
  const uri = environment.gUrl;
  const ws = new WebSocketLink({
    uri: environment.ws,
    options: {
      reconnect: true,
    },
  });

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
    return onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) graphQLErrors.map(({ message }) => errorMSG(message));
      if (networkError) errorMSG(networkError.message);
    });
  };
  const errorMSG = (msg: string): void => {
    const m = msg.includes('failure')
      ? 'サーバー接続問題が発生しました！'
      : msg;
    const u = msg.includes('401') ? true : false;
    const p = msg.includes('400') ? true : false;
    const c = msg.includes('Permission Denied');
    const a = msg.includes('QRスキャン');
    console.log(msg);
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
  declarations: [AppComponent, CViewBoardComponent, CBurgerComponent, CEmployeeCardComponent],
  imports: [
    MaterialModules,
    BrowserModule,
    AppRoutingModule,
    ApolloModule,
    HttpClientModule,
    BrowserAnimationsModule,
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
                    merge(existing, incoming) {
                      return incoming;
                    },
                  },
                },
              },
            },
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
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: LOCALE_ID, useValue: "ja-JP" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
