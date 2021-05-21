import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as moment from 'moment';

const Ordenes = props => {

    const [ordenes, setOrdenes] = useState([]);
    const [producto, setProducto] = useState([]);
    const [fechaDesde, setFechaDesde] = useState(moment().format("YYYY-MM-DD"));
    const [fechaHasta, setFechaHasta] = useState(moment().format("YYYY-MM-DD"));
    const [totales, setTotales] = useState(null);

    useEffect(() => {
        getOrdenes();
    }, []);

    const getOrdenes = async () => {
        console.log(`${process.env.REACT_APP_URL_API}/ordenes`)
        await axios.post(`${process.env.REACT_APP_URL_API}/ordenes`, {
            fechaDesde: fechaDesde != null ? fechaDesde : "2010-01-01",
            fechaHasta: fechaHasta != null ? fechaHasta : "2030-01-01"
        })
            .then(res => {
                console.log(res)
                setOrdenes(res.data);
                
            })
            .catch(err => console.log(err));
    }


    useEffect(() => {
        calcularTotales();
    }, [ordenes]);

    const calcularTotales = () => {
        const tot = {totalTotal : 0 , totalCargoML : 0 , totalImpuestoIB :0 , totalTotalRecibido : 0 , totalDineroFlex : 0 , totalNeto : 0}
        ordenes.map(o => {
            tot.totalTotal += o.total;
            tot.totalCargoML += o.cargoML;
            tot.totalImpuestoIB += o.impuestoIB;
            tot.totalTotalRecibido += o.totalRecibido;
            tot.totalDineroFlex += o.dineroFlex;
            tot.totalNeto += o.neto;
        });
        console.log(tot);
        setTotales(tot);
    }

    return (
        <div>
            <form className="bg-dark">
                <div className="form-group">
                    <label htmlFor="fechaDesde">Desde</label>
                    <input type="date" className="form-control" id="fechaDesde" value={fechaDesde} onChange={e => setFechaDesde(moment(e.target.value).format("YYYY-MM-DD"))} />
                </div>
                <div className="form-group">
                    <label htmlFor="fechaHasta">Hasta</label>
                    <input type="date" className="form-control" id="fechaHasta" value={fechaHasta} onChange={e => setFechaHasta(moment(e.target.value).format("YYYY-MM-DD"))} />
                </div>
                <button type="button" className="btn btn-primary m-3" onClick={() => getOrdenes()}>Buscar</button>
            </form>

            <table className="table table-bordered table-dark">
                <thead>
                    <tr>
                        <th scope="col">Publicacion</th>
                        <th scope="col">Titulo</th>
                        <th scope="col">Total</th>
                        <th scope="col">Cargo ML</th>
                        <th scope="col">Impuesto IIBB</th>
                        <th scope="col">Recibido</th>
                        <th scope="col">Dinero Flex</th>
                        <th scope="col">Neto</th>
                    </tr>
                </thead>
                <tbody>
                    {totales && 
                    <tr>
                    <th scope="row">TOTALES</th>
                    <td>*</td>
                    <td style={{ textAlign: 'end' }}>{totales.totalTotal.toFixed(2)}</td>
                    <td style={{ textAlign: 'end' }}>- $ {totales.totalCargoML.toFixed(2)}</td>
                    <td style={{ textAlign: 'end' }}>- $ {totales.totalImpuestoIB.toFixed(2)}</td>
                    <td style={{ textAlign: 'end' }}>$ {totales.totalTotalRecibido.toFixed(2)}</td>
                    <td style={{ textAlign: 'end' }}>- $ {totales.totalDineroFlex.toFixed(2)}</td>
                    <td style={{ textAlign: 'end' }}>{totales.totalNeto.toFixed(2)}</td>
                </tr>}
                    
                    {ordenes.map(orden =>

                        <tr onClick={() => setProducto(orden)} key={orden._id}>
                            <th scope="row">{orden.idProducto}</th>
                            <td>{orden.titulo}</td>
                            <td style={{ textAlign: 'end' }}>{orden.total.toFixed(2)}</td>
                            <td style={{ textAlign: 'end' }}>- $ {orden.cargoML.toFixed(2)}</td>
                            <td style={{ textAlign: 'end' }}>- $ {orden.impuestoIB.toFixed(2)}</td>
                            <td style={{ textAlign: 'end' }}>$ {orden.totalRecibido.toFixed(2)}</td>
                            <td style={{ textAlign: 'end' }}>- $ {orden.dineroFlex.toFixed(2)}</td>
                            <td style={{ textAlign: 'end' }}>$ {orden.neto.toFixed(2)}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Ordenes;