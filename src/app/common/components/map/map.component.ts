import { Component, effect, input, output } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  coordenada = input<{ lat: number, lng: number }>();
  coordenadaChange = output<{ lat: number, lng: number }>();

  // Map
  private map!: L.Map;
  private userMarker!: L.Marker;

  constructor() {
    // this.initMap();
    effect(() => {
      this.coordenada();
      console.log("Se activó el effect del componente map");
      this.userMarker?.setLatLng([
        this.coordenada()?.lat ?? -12.0464,
        this.coordenada()?.lng ?? -77.0428
      ]);
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-9.19, -75.015], // Centro geográfico del Perú
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    const blueIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
      shadowUrl:
        "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Marcador de prueba
    // L.marker([-12.0464, -77.0428], { icon: blueIcon, draggable: true })
    //   .addTo(this.map)
    //   .bindPopup('Aquí estás tú 😎')
    //   .openPopup();

    this.userMarker = L.marker([this.coordenada()?.lat ?? -12.0464, this.coordenada()?.lng ?? -77.0428], { icon: blueIcon })
      .addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => this.detectarPosicion(e));
  }

  detectarPosicion(e: L.LeafletMouseEvent) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    this.userMarker.setLatLng([lat, lng]);
    this.coordenadaChange.emit({ lat, lng });
  }
}
