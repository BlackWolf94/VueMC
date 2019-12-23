/**
 * @author Dmytro Zataidukh
 * @created_at 11/3/19
 */
import Vue from 'vue';

declare module 'vue/types/vue' {
  // tslint:disable-next-line:interface-name
  interface Vue {
    $mcServerSSR(): void; // enable mc server render
    $mcServerSSRContext(): string; // get ssr context
    $mcClientSSR(key: string): string; // enable ssr in client bundle
  }
}
