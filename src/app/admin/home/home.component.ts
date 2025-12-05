
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { MaterialModule } from '../../material/material.module';
import { RouterLink } from '@angular/router';

register();

interface Tienda {
  nombre: string;
  plan: string;
  ventas: number;
  productos: number;
  calificacion: number;
}

interface Producto {
  nombre: string;
  categoria: string;
  busquedas: number;
}
@Component({
  selector: 'app-home',
  imports: [MaterialModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  // KPIs principales
  tiendasActivas: number = 100;
  nuevasTiendasMes: number = 8;
  ingresosMensuales: number = 15750.00;
  crecimientoIngresos: number = 12.5;
  totalProductos: number = 3450;
  categoriaProductos: number = 25;
  pedidosMes: number = 892;
  pedidosPendientes: number = 23;

  // Distribución de planes
  totalTiendas: number = 100;
  tiendasPlanBasico: number = 20;
  tiendasPlanPro: number = 15;
  tiendasPlanPremium: number = 10;

  // Alertas
  suscripcionesPorVencer: number = 5;
  tiendasInactivas: number = 3;
  pagosRechazados: number = 2;

  // Top tiendas
  topTiendas: Tienda[] = [
    { nombre: 'AutoPartes del Norte', plan: 'Premium', ventas: 12500, productos: 450, calificacion: 4.8 },
    { nombre: 'Repuestos Lima', plan: 'Pro', ventas: 9800, productos: 320, calificacion: 4.7 },
    { nombre: 'MotorParts SAC', plan: 'Premium', ventas: 8900, productos: 380, calificacion: 4.9 },
    { nombre: 'AutoServicio Express', plan: 'Pro', ventas: 7650, productos: 280, calificacion: 4.6 },
    { nombre: 'Refacciones Total', plan: 'Básico', ventas: 6200, productos: 150, calificacion: 4.5 }
  ];

  // Productos más buscados
  productosMasBuscados: Producto[] = [
    { nombre: 'canto grande', categoria: 'Lima', busquedas: 50 },
    { nombre: 'polideportivo callao', categoria: 'Lima', busquedas: 80 },
    { nombre: 'complejo mariscal', categoria: 'Ayacucho', busquedas: 140 }
  ];

  // Cálculo de porcentajes
  get porcentajePlanBasico(): number {
    return (this.tiendasPlanBasico / this.totalTiendas) * 100;
  }

  get porcentajePlanPro(): number {
    return (this.tiendasPlanPro / this.totalTiendas) * 100;
  }

  get porcentajePlanPremium(): number {
    return (this.tiendasPlanPremium / this.totalTiendas) * 100;
  }

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    console.log('Cargando datos del dashboard...');
  }
}