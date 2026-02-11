// ═══════════════════════════════════════════════════════════
// ENTIDAD: Cliente
// ═══════════════════════════════════════════════════════════

export interface Cliente {
    id_cliente: number;
    nombre: string;
    telefono: string | null;
    limite_credito: number;
    saldo_pendiente: number;
}
