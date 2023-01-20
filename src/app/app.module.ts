import { NgModule } from '@angular/core';
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
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from '@apollo/client/utilities';

const newHttpLink = (link: HttpLink): ApolloLink => {
  const uri = 'http://localhost:3000/graphql';
  const ws = new WebSocketLink({
    uri: `ws://localhost:3000/graphql`,
    options: {
      reconnect: true
    }
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
      if (graphQLErrors)
        graphQLErrors.map(({ message }) => errorMSG(message));
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
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    ws,
    errorlink().concat(Mainlink)
  );

  return xlink;
};

@NgModule({
  declarations: [AppComponent, CViewBoardComponent],
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
          cache: new InMemoryCache(),
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
