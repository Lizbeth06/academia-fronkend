export interface RespuestaApi<T> {
  hasSucceeded: boolean;
  statusCode: number;
  value: T;
}
