

var final_results = []
var final_out = []


function readTsv() {
  var file = document.querySelector('input[type=file]').files[0];
  if (file == null) {
    alert("Please select a TSV file with your oligos!")
    return;
  }
  var plasmid = document.querySelector('input[type=text]').value;
  if (plasmid.trim() == "Enter Construct Name." || plasmid.trim() === "") {
    alert("Please provide the name of your template construct.")
    return;
  }

  d3.tsv(file.name).then(function (d) {
        console.log(file.name)
        console.log(d.columns);
        parseOligos(d, plasmid);
    });

  }

function parseOligos(olg, template) {
  console.log("printing oligos");
  console.log(olg);
  const construct = template;
  const backboneName = olg[0].label;
  const backboneF = olg[0].p1name;
  const backboneR = olg[0].p2name;
  const backboneList = [backboneF, backboneR, construct, backboneName]
  const results = [];
  const outfiles = [];
  const oligos = []
  for (var index in olg) {
    //console.log(olg[index])
    if (index > 0) {
      results.push(generateConstructionFile(olg[index], backboneList));
      outfiles.push("Construction of " + olg[index].plasmidname + ".txt")
      oligos.push([olg[index].p1name, olg[index].p1seq, olg[index].p2name,
        olg[index].p2seq])
    }
  }
  let lines = document.getElementById("construction_out");
  //if (lines.includes(document.pre)) {
    //document.pre.innerText = " ";
  //}
  //console.log(lines)
  //console.log("printed lines")
  //if (lines.length > 0) {
    //console.log(lines)
    //lines = "";
  //}
  for (var index in results) {
    item = results[index];
    out = outfiles[index];
    let pre = document.createElement("pre");
    pre.innerText = item;
    lines.appendChild(pre);

    /*writeToFile(item, out)*/
    /*fs.writeFile(out, pre, err => {
      if (err) {
        console.error(err)
        return
      }
    })*/
  }
  final_results = results;
  final_out = outfiles;
  //console.log(final_out);

  console.log(oligos);

  let btn1 = document.createElement("button");
  btn1.name = "OligoChecker";
  btn1.type = "submit";
  btn1.innerHTML = "Check Primers";
  btn1.onclick = function () {
  oligoCheckerAll(oligos);
  };
  document.body.appendChild(btn1);


  document.getElementById("submit").disabled = true;

  let btn = document.createElement("button");
  btn.name = "Download";
  btn.type = "submit";
  btn.innerHTML = "Download ZIP";
  btn.onclick = function () {
  downloadAll();
  };
  document.body.appendChild(btn);

  //if (document.getElementById("submit").disabled == true) {
  //  document.getElementById("downloadButton").style.display = 'block';
  //}

}


function writeToFile(text, out) {
  var textFile = null,
    makeTextFile = function (text) {
      var data = new Blob([text], {type: 'text/plain'});

      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      textFile = window.URL.createObjectURL(data);

      return textFile;
    };
    download = document.getElementById('download'),
    download.addEventListener('click', function () {
      var link = document.getElementById('downloadlink');
      link.href = makeTextFile(text);
      link.style.display = 'block';
    }, false);
}

function downloadAll() {
  var zip = new JSZip();

  for (var index in final_results) {
    let text = final_results[index];
    let filename = final_out[index];
    zip.file(filename, text);

  }
  zip.generateAsync({type:"blob"}).then(function(content) {
    // see FileSaver.js
    saveAs(content, "constructionFiles.zip");
});
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
    document.getElementById("download").disabled = true;
}


function generateConstructionFile(info, blist) {
  var p1name = info.p1name;
  var p2name = info.p2name;
  var p1seq = info.p1seq;
  var p2seq = info.p2seq;
  var p1amount = info.p1amount;
  var p2amount = info.p2amount;
  var p1pur = info.p1pur;
  var p2pur = info.p2pur;
  var p1desc = info.p1desc;
  var p2desc = info.p2desc;
  var gname = info.gname;
  var label = info.label;
  var gseq = info.gseq;
  var pname = info.plasmidname;
  const bOlgF = blist[0];
  const bOlgR = blist[1];
  const c = blist[2];
  const cname = blist[3];
  //var construct = c;
  //var constructName = cName;

  var line1 = "PCR " + bOlgF + "/" + bOlgR + " on " + c + "\t\t\t" + "(" + cname + ")\n";
  var line2 = "PCR " + p1name + "/" + p2name + " on " + gname + "\t\t\t" + "(" + gseq.length + "bp, " + label + ")\n";
  var line3 = "Assemble " + cname +"," + label + "\t\t\t\t" + "(BsaI, " + pname + ")\n";
  var line4 = "Transform " + pname + "\t\t\t\t" + "(Mach1, Amp)";


  return line1 + line2 + line3 + line4
}

function oligoCheckerAll(oligos) {
  for (var olg in oligos) {
    writeOutput("Checking Row: " + olg)
    oligoChecker(oligos[olg]);
  }
}


function oligoChecker(oligo) {
  p1n = oligo[0]
  p1s = oligo[1].toLowerCase()
  p2n = oligo[2]
  p2s = oligo[3].toLowerCase()
  //console.log(p1n);
  //console.log(p2n);
  var check1 = false;
  var check2 = false;
  var check3 = false;
  var check4 = false;

  // 1st check: if each seq has BsaI site
  var bsaI_f = "ggtctc";
  var bsaI_r = "ccagag";
  if ((p1s.includes(bsaI_f) | p1s.includes(bsaI_r))
    & (p2s.includes(bsaI_f) | p2s.includes(bsaI_r))) {
      check1 = true;
      writeOutput("Check1: restriction site check 100% complete")
    } else {
      if (!(p1s.includes(bsaI_f) | p1s.includes(bsaI_r))) {
        writeOutput("Primer 1: " + p1n + " does not have BsaI site");
      } if (!(p2s.includes(bsaI_f) | p2s.includes(bsaI_r))) {
        writeOutput("Primer 2: " + p2n + " does not have BsaI site");
      } else {
        writeOutput("check primers for correct BsaI restriction site.");
      }
  }

  // 2nd check: if length is 18-40bp
  if ((p1s.length >= 18 & p1s.length <= 40) &
      p2s.length >= 18 & p2s.length <= 40) {
    check2 = true;
    writeOutput("Check2: primer length check is 100% compelete")
  } else {
    if (p1s.length < 18 | p1s.length > 40) {
      writeOutput("Primer 1: " + p1n + " should be between 18-40bp. Current length is: " + p1s.length);
    } if (p2s.length < 18 | p2s.length > 40) {
      writeOutput("Primer 2: " + p2n + " should be between 18-40bp. Current length is: " + p2s.length);
    } else {
      writeOutput("check primers for correct length. should be between 18-40bp");
    }
  }
  // 3rd check: if GC content is 40-60% or higher

  var p1counts = charCount(p1s);
  var p2counts = charCount(p2s);
  var p1GC = (p1counts[1] + p1counts[2]) / p1s.length;
  var p2GC = (p2counts[1] + p2counts[2]) / p2s.length;
  //console.log(p1counts)

  if ((p1GC >= 0.4) & (p2GC >= 0.4)) {
    check3 = true;
    writeOutput("Check3: gc percentage check 100% complete");
  } else {
    if (p1GC < 0.4) {
      writeOutput("Primer 1: " + p1n + "  GC content should be between 40-60%. Currently it is at " + Math.round(p1GC*100))
    } if(p2GC < 0.4) {
      writeOutput("Primer 2: " + p2n + "  GC content should be between 40-60%. Currently it is at " + Math.round(p2GC*100))
    } else {
      writeOutput("check primers for GC content. should be between 40-60%");
    }
  }

  // 4th check: 4 or more nucleotide or dinucleotide repeats
  var repeats = ["aaaa", "gggg", "cccc", "tttt","atat", "tata",
                  "acac", "caca", "agag", "gaga", "ctct", "tctc",
                  "cgcg", "gcgc", "gtgt", "tgtg"]

  var counter = 0;
  for (var i in repeats) {
    if (p1s.includes(i)) {
      writeOutput("Primer 1: " + p1n + "includes repeat seqeunce " + i);
    } if (p2s.includes(i)) {
      writeOutput("Primer 2: " + p2n + "includes repeat seqeunce " + i);
    } else {
      counter += 1;
    }
  }
  if (counter == repeats.length) {
    check4 = true;
    writeOutput("Check4: no >=4 nucleotide or dinucleotide repeats check 100% complete.")
  } else {
    writeOutput("check primers for repeats")
  }

  if (check1 & check2 & check3 & check4) {
    writeOutput("All primers checked! Nothing to worry about.")
  } if(!check1) {
    writeOutput("Failed Check1: If each primer has BsaI site.")
  } if (!check2) {
    writeOutput("Failed Check2: If each primer has length between 18-40bp.")
  } if (!check3) {
    writeOutput("Failed Check3: If each primer has GC content between 40-60% or higher.")
  } if (!check4) {
    writeOutput("Failed Check4: Either or both primers have runs of nucleotides or dinucleotides.")
  }

}

function writeOutput(text) {
  console.log(text);
  let p = document.createElement("p");
  p.innerText = text;
  document.body.appendChild(p);

}

function charCount(seq) {
  seq = seq.toLowerCase();
  //console.log(seq)
  let a = 0;
  let c = 0;
  let g = 0;
  let t = 0;
  for (var pos = 0; pos < seq.length; pos++) {
    if (seq.charAt(pos) == 'a') {
      a += 1;
    } else if (seq.charAt(pos) == 'c') {
      c += 1;
    } else if (seq.charAt(pos) == 'g') {
      g += 1;
    } else if (seq.charAt(pos) == 't') {
      t += 1;
    } else {

    }
  }
  var counts = [a, c, g, t]
  return counts;
}
