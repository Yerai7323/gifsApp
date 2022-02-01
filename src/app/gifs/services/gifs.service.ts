import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data, Response } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private api_key = 'FPFOmnyFL5NRfdAH76EqzUDV6FgDOQkW';
  private servicioURL = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Data[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('historialGifs')!) || [];
  }

  buscarGifs(busqueda: string) {
    const busquedaToLower = busqueda.trim().toLowerCase();
    if (busquedaToLower && !this._historial.includes(busquedaToLower)) {
      this._historial.unshift(busquedaToLower);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.api_key)
      .set('q', busquedaToLower)
      .set('limit', '10');

    this.http
      .get<Response>(`${this.servicioURL}/search`, { params })
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;

        localStorage.setItem('historialGifs', JSON.stringify(resp.data));
      });
  }
}
