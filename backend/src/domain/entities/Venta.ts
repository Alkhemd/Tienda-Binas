// ═══════════════════════════════════════════════════════════
// ENTIDAD: Venta
// ═══════════════════════════════════════════════════════════

export interface Venta {
    id_venta: number;
    id_cliente: number | null;
    id_empleado: number;
    fecha_venta: Date;
    total: number;
    tipo_pago: 'efectivo' | 'tarjeta' | 'fiado';
}

export interface VentaConRelaciones extends Venta {
    cliente?: string;
    empleado?: string;
}

export interface DetalleVenta {
    id_detalle: number;
    id_venta: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

export interface DetalleVentaConProducto extends DetalleVenta {
    producto?: string;
    codigo_barras?: string;
}
