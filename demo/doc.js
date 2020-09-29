const officegen = require('officegen')
const fs = require('fs')

// Create an empty Word object:
let docx = officegen('docx')

// Officegen calling this function after finishing to generate the docx document:
docx.on('finalize', function(written) {
	console.log(
		'Finish to create a Microsoft Word document.'
	)
})

// Officegen calling this function to report errors:
docx.on('error', function(err) {
	console.log(err)
})

var pObj = docx.createP ();
pObj.addText ( '一、血液透析（滤过）能有效清除身体内过多的水分合霉素，是治疗急性和慢性肾衰竭等疾病的有效方法。' );
var pObj = docx.createP ();
pObj.addText ( '二、血液透析（滤过）治疗时，首先需要将患者血液引到体外，然后通过透析或滤过等方法清除水分和霉素，经受理后的血液再回到患者体外。' );
var pObj = docx.createP ();
pObj.addText ( '三、为了有效引出血液，治疗前需要建立血管通路（动静脉内痿或深静脉插管）。' );
var pObj = docx.createP ();
pObj.addText ( '四、为防止血液在体外管路和透析器发生凝固，一般需要在透析前和透析过程中注射肝素等抗凝药物。' );
var pObj = docx.createP ();
pObj.addText ( '五、血透过程中和治疗期间存在下列医疗风险，可能造成严重后果，甚至危及生命：' );
var pObj = docx.createP ();
pObj.addText ( '1.低血压，心力衰竭，心肌梗塞，心律失常，脑血管意外；' );
var pObj = docx.createP ();
pObj.addText ( '2.空气球栓塞；' );
var pObj = docx.createP ();
pObj.addText ( '我很帅的哈哈哈哈！我很帅！' , { font_face: 'Symbol', font_size: 20 } );

// We can even add images:
// pObj.addImage('some-image.png')

// Let's generate the Word document into a file:

let out = fs.createWriteStream('example.docx')

out.on('error', function(err) {
	console.log(err)
})

// Async call to generate the output file:
docx.generate(out)
