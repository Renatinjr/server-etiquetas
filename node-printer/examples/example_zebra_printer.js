var printer = require("../lib");


const express = require('express');
const app = express();


async function gerarZpl(nome, inicio, fim, numeroEtiqueta) {
	const inicioDig = inicio.toString().padStart(6, '0');
	const fimDig = fim.toString().padStart(6, '0');
	const zpl = `
    ^XA
    ^FX
    ^CFA,30
    ^FO0,20^FDINVENTARIO^FS

	^FO60,50^GFA,512,512,8,07RFE,1TF83TFC7TFE:!::::IFC07KF1!IF803JFE0!IF803JFC03!:IF803JF803!IF803JF007!IF803IFE00!IF803IFC01!IF803IF803!IF803IF007!IF803FFE00!:IF803FFC01!IF803FF803!IF803FF007!IF803FE00!IF803FC01!IF803F803!IF803F007!IF803F00!IF803F007!IF803F803!:IF803FC01!IF803FE00!IF803FF007!IF803FF803!:IF803FFC01!IF803FFE00!IF803IF007!IF803IF803!IF803IFC01!:IF803IFE00!IF803JF007!IF803JF803!IF803JFC01!:IF803JFE03!IF803KF07!IF807KF8!!::::::7TFE:3TFC1TF807RFE,^FS

    ^FX
    ^CFA,50
    ^FO0,130^FD${nome}^FS

    ^FX
    ^CFA,30
    ^FO260,15^FD${inicioDig}-${fimDig}^FS

    ^FX CODIGO DE BARRAS
    ^BY3,2,40
    ^FO225,45^BC^FD${numeroEtiqueta}^FS

    ^CFA,20
    ^FO440,88^GB140,95,3^FS
    ^FO450,98^FDQUANTIDADE^FS

    ^XZ`;

	return zpl;

}


async function imprimir(gerarZplRaw) {
	printer.printDirect({
		data: gerarZplRaw, printer: "ZDesigner GC420t", type: "RAW",
		success: function () {
			console.log("etiqueta impressa");
		}
		, error: function (err) { console.log(err); }
	});
}


async function loop(inicio, fim, nome)  {
	console.log('loop 0')
	let iDig = inicio.toString().padStart(6, '0');
	let fDig = fim.toString().padStart(6, '0');
	for (let i = iDig; i <= fDig; i++) {
		console.log('loop 1')
		const numeroEtiqueta = i.toString().padStart(6, '0');
		const gerarZplRaw = await gerarZpl(nome, inicio, fim, numeroEtiqueta);
		imprimir(gerarZplRaw);
	}

}




//printZebra("123", "ZDesigner GC420t");



app.get('/imprimir-zpl', (req, res) => {
	const {nome, inicio, fim} = req.query
	loop(inicio,fim, nome);

	res.status(200).json({status:'ok', mensagem:'Tudo certo'})


});

app.listen(3003, () => {
	console.log('Server started on port 3003');
  });