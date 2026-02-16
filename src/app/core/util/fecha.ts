/**
  * Función que retorna una fecha en formato ISO 8601
  * @param {Date} fecha - Fecha de entrada
  * @returns {string} Fecha de salida en formato yyyy-MM-dd
  */
export function formatoFechaISO(fecha: Date):string|null{
    try{
      const anio = fecha.getFullYear();
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const dia = fecha.getDate().toString().padStart(2, '0');  // Día con 2 dígitos
      return `${anio}-${mes}-${dia}`;
    }catch{
      return null;
    }
  }
  
  //new Date((typeof data.fechaExpediente=='string')?data.fechaExpediente.slice(0,16):null),
  
  /**
    * Obtiene la fecha ya sea que ingrese en formato date o string
    * @param {Date} fecha - Fecha de entrada
    * @returns {string} Fecha de salida en formato yyyy-MM-dd
    */
  export function obtenerDate(fecha: Date|String):Date{
    if(typeof fecha == "string"){
      return new Date(fecha.slice(0,16))
    }else if(fecha instanceof Date){
      return fecha;
    }else{
      return new Date();
    }
  }