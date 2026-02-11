// ═══════════════════════════════════════════════════════════
// ENTIDAD: Producto
// ═══════════════════════════════════════════════════════════

export interface Producto {
    id_producto: number;
    codigo_barras: string;
    nombre: string;
    id_categoria: number;
    id_proveedor: number;
    precio_venta: number;
    stock_actual: number;
    fecha_caducidad: Date | null;
}

export interface ProductoConRelaciones extends Producto {
    categoria?: string;
    proveedor?: string;
}
