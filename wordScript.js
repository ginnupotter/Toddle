 
    /*
    Author: Varun Aggarwal

    Created as a hobby project to replicate the game Wordle with my own take on the logic. The whole code was writtent from scratch with no reference to the original wordle game.

    Wanted to implement a real time webservice call to dictionary API for validation however due to CORS issue, had to work with a comprehensive list of 5 letter english words (The list was the only thing taken from original wordle)

    This project can be used for creating a personalized version by simply updating the word list and the validation lists in thie file.

    */
    
    
     var word = ""; // Global variable to set the word for the day, accessible throughout the script
     var counter = 0;
     var matched = 0;
     var greenChars = [];
     var yellowChars = [];




 
 /*Function to disable all but first row and bring focus to first character on page load*/
 function onPageload() {
     
    word = setWord();
      //var wordnum = 1;
      for (let index = 0; index < 6; index++) {
                document.getElementsByName("row" + index).forEach(e => {
          e.disabled = true;
        });
      }
     document.getElementById("00").focus();
    }

    function countString(str, letter) {

      // creating regex 
      const re = new RegExp(letter, 'ig');

      // matching the pattern
      const count = str.match(re).length;

      return count;
    }

    function find(needle, arr) {
    var results = [];
    var idx = arr.indexOf(needle);
  //  alert(idx);
    while (idx != -1) {
        results.push(idx);
        idx = arr.indexOf(needle, idx + 1);
       // alert(idx);
    }
   //alert(results.toString());
    return results;
}
    //Function to clear the grid for taking a screenshot for sharing.
    function clearGrid() {
      for (let index = 0; index < 6; index++) {
        document.getElementsByName("row" + index).forEach(e => {
        e.value = "";
        });

      }
      document.getElementById("buttonPress").style.visibility = "hidden";
      document.getElementById("dateDiv").className = "linkVisible";
      document.getElementById("howTo").style.visibility = "hidden";
      document.getElementById("disclaimer").style.visibility = "hidden";
      document.getElementById("keyboard").style.visibility = "hidden";
      document.getElementById("heading").remove();
      
      return;
    }

    function onKeyboardClick(keyId) {
      let enteredWord = document.getElementsByName("row" + counter + "");
      
      if(keyId=="back") {
        for (let index = enteredWord.length -1; index >= 0; index--) {
          if(enteredWord[index].value.length == 0 ) {
            continue;
          } else {
            enteredWord[index].value = "";
            return;
          }
        }  
      } else {

        for (let index = 0 ; index < enteredWord.length; index++) {
          if(enteredWord[index].value.length == 0 ) {
            enteredWord[index].value = document.getElementById(keyId).value;
            return;
          } else {
            continue;
          }
        }
    }

    }

    //Main logic function which does the matching against the word of the day.
    function onSubmit() {

      if(matched==1) {
        clearGrid();
        return;
      }

      var keyWord = Array.from(word);
      let enteredWord = document.getElementsByName("row" + counter + "");
      var charCheck = new Array(enteredWord.length);
      var copyEnteredWord = new Array(enteredWord.length);
      var keyCharCount = new Array(word.length);
      var enteredCharCount = new Array(enteredWord.length);
      var matchReturn = 0;
      var matchCounter = 0;

      var dispMsgIncomplete = "Insufficient Letters Entered";
      var dispMsgComplete = "Congratulations";
      var dispMsgInvalidWord = "Not in the word list";
     
      //Taking the input from submitted row into an array of characters
      for (let index = 0; index < enteredWord.length; index++) {
        copyEnteredWord[index]=enteredWord[index].value;
      }
      
      //Check if all input fields were filled
      if(copyEnteredWord.join("").length < keyWord.length) {
        showMessage(dispMsgIncomplete);
        enteredWord[enteredWord.length-1].focus();
        return;
      } else if (copyEnteredWord.join("").length == keyWord.length) {
        if(!checkValidity(copyEnteredWord.join("").toUpperCase())) {
          showMessage(dispMsgInvalidWord);
          enteredWord[enteredWord.length-1].focus();
          return;
        }
      }
      
      for (let index = 0; index < enteredWord.length; index++) { //Main loop where each letter is checked for matching against the word of the day
     
        if(!enteredWord[index].value) { //redundant now as incomplete check is already implemented outside the main loop.
          showMessage(dispMsgIncomplete);
          enteredWord[index].focus();
          return;
        }

        matchReturn = matchingLogic(keyWord,enteredWord[index].value.toUpperCase() , index);
        if (matchReturn == 1) {
          charCheck[index] = 1;
          matchCounter++;

        } else if (matchReturn == 2) {

          charCheck[index] = 2;

        } else if (matchReturn == 0) {
          charCheck[index] = 0;

        }

      }

      for (let index = 0; index < enteredWord.length; index++) {
        if (charCheck[index] == 1) {
          document.getElementById("" + counter + "" + index + "").className = "wordleCharsGreen";
          document.getElementById("" + counter + "" + index + "").setAttribute("disabled", "disabled");
          debugger;
          if(!greenChars.includes(copyEnteredWord[index].toUpperCase())) {
          greenChars.push(copyEnteredWord[index].toUpperCase());
          document.getElementById(""+copyEnteredWord[index].toUpperCase()+"").className = "wordleKeyboardGreen";
          }
         
        } else if (charCheck[index] == 2) { //Logic to ensure that in case of a letter being entered multiple times, total of green and yellow classifications don't exceed the total number of times the letter appears in the owrd of the day
         
          var charCountEnteredWord = countString(copyEnteredWord.join(""),enteredWord[index].value);
          var charCountKeyWord = countString(word,enteredWord[index].value);

          if (charCountEnteredWord <= charCountKeyWord) {
            document.getElementById("" + counter + "" + index + "").className = "wordleCharsYellow";
            document.getElementById("" + counter + "" + index + "").setAttribute("disabled", "disabled");

            if(!greenChars.includes(copyEnteredWord[index].toUpperCase())) {
            yellowChars.push(copyEnteredWord[index].toUpperCase());
            document.getElementById(""+copyEnteredWord[index].toUpperCase()+"").className = "wordleKeyboardYellow";
            }
            continue;
          } else if (charCountEnteredWord > charCountKeyWord) {
            var enteredMatchIndexes = [];
            enteredMatchIndexes = find(enteredWord[index].value,copyEnteredWord);
            var charGreenCounter = 0;
            var charYellowCounter = 0;
            for (let index2 = 0; index2 < enteredMatchIndexes.length; index2++) {
             
                if(charCheck[enteredMatchIndexes[index2]]==1) {
                  charGreenCounter++;
                } else if (charCheck[enteredMatchIndexes[index2]]==2 && enteredMatchIndexes[index2] <= index) {
                  charYellowCounter++;
                }
              }
            }
           // alert("charGreenCounter"+charGreenCounter);  alert("charYellowCounter"+charYellowCounter); alert(charGreenCounter+charYellowCounter);

            if((charGreenCounter+charYellowCounter)> charCountKeyWord) {
              document.getElementById("" + counter + "" + index + "").className = "wordleCharsGrey";
              document.getElementById("" + counter + "" + index + "").setAttribute("disabled", "disabled");

              if(!greenChars.includes(copyEnteredWord[index].toUpperCase()) && !yellowChars.includes(copyEnteredWord[index].toUpperCase())) {
              document.getElementById(""+copyEnteredWord[index].toUpperCase()+"").className = "wordleKeyboardGrey";
              }
            } else {
              document.getElementById("" + counter + "" + index + "").className = "wordleCharsYellow";
              document.getElementById("" + counter + "" + index + "").setAttribute("disabled", "disabled");
              if(!greenChars.includes(copyEnteredWord[index].toUpperCase())) {
                yellowChars.push(copyEnteredWord[index].toUpperCase());
                document.getElementById(""+copyEnteredWord[index].toUpperCase()+"").className = "wordleKeyboardYellow";
                }
            }
          } else if (charCheck[index] == 0) {
          
          document.getElementById("" + counter + "" + index + "").className = "wordleCharsGrey";
          document.getElementById("" + counter + "" + index + "").setAttribute("disabled", "disabled");
          if(!greenChars.includes(copyEnteredWord[index].toUpperCase()) && !yellowChars.includes(copyEnteredWord[index].toUpperCase())) {
          document.getElementById(""+copyEnteredWord[index].toUpperCase()+"").className = "wordleKeyboardGrey";
          }
        }        


      }


      if (matchCounter == enteredWord.length) {
        showMessage(dispMsgComplete);
        document.getElementById("keyboard").style.visibility = "hidden";
        document.getElementById("keyboard").remove();
        document.getElementById("buttonPress").value = "Clear Grid to Share";
        document.getElementById("buttonPress").style.visibility = "visible";
        matched = 1;
        return;
      } else if (counter == 5 && matchCounter < enteredWord.length) {
        
        showMessage("The word is "+word);
        return;
      }
              
      
      
/*       document.getElementsByName("row" + counter).forEach(e => {
        e.disabled = true;
      }); */
      
      counter++;
      
/*       document.getElementsByName("row" + counter).forEach(e => {
        e.disabled = false;
      });
      document.getElementById(counter+"0").focus(); */ // Bring focus to next row first box
    }


    function matchingLogic(keyWrd, enteredChar, index) {

      if (keyWrd[index] == enteredChar) {
        return 1;
      } else if (keyWrd.includes(enteredChar)) {
        return 2;
      } else {
        return 0;
      }
    }
    
    //Show snackbar message onscreen
    function showMessage(dispMsg) {
     // alert(dispMsg);
    document.getElementById("snackbar").innerHTML = dispMsg;
      
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

 
 //Function called at pageload to set the word of the day based on the day(number) of the year

 function setWord() {
      
  var wordList = new Array("FAT","CAT","MAT","BIT","TAP","DOG","POP","SIP","DIP","PAN","BAT","AND","FIX","OWN","ARE","FLY","ODD","APE","FRY","OUR","ACE","FOR","PET","ACT","GOT","PAT","ASK","GET","PEG","ARM","GOD","PAW","AGE","GEL","PUP","AGO","GAS","PIT","AIR","HAT","PUT","ATE","HIT","POT","ALL","HAS","POP","BUT","HAD","PIN","BYE","HOW","RAT","BAD","HER","RAG","AND","FIX","OWN","ARE","FLY","ODD","APE","FRY","OUR","ACE","FOR","PET","ACT","BIG","HIS","RUB","BED","HEN","ROW","BAT","INK","RUG","BOY","ICE","RUN","BUS","ILL","RAP","BAG","JAB","RAM","BOX","JUG","SOW","BIT","JET","SEE","BEE","JAM","SAW","BUY","JAR","SET","BUN","JOB","SIT","CUB","JOG","SIR","CAT","KIT","SAT","CAR","KEY","SOB","CUT","LOT","TAP","COW","LIT","TIP","CRY","LET","TOP","CAB","LAY","TUG","CAN","MAT","TOW","DAD","MAN","TOE","DAB","MAD","TAN","DAM","MUG","TEN","DID","MIX","TWO","DUG","MAP","USE","DEN","MUM","VAN","DOT","MUD","VET","DIP","MOM","WAS","DAY","MAY","WET","EAR","MET","WIN","EYE","NET","WON","EAT","NEW","WIG","END","NAP","WAR","ELF","NOW","WHY","EGG","NOD","WHO","FAR","NET","WAY","FAT","NOT","WOW","FEW","NUT","YOU","FAN","OAR","YES","FUN","ONE","YAK","FIT","OUT","YET","FIN","OWL","ZIP","FOX","OLD","ZAP");
  //var fileContents = readTextFile('https://drive.google.com/file/d/1-dVy7b0zlWTtsPiBSO9IW9lEEOZlCumv/view?usp=sharing');
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay); //find day of the year to pick the word from the array
  if(day > 180) {
    return wordList[day-50];

  } else {
  return wordList[day];
  }
}


//Divided the complrehensive word list into three parts to speed up the comparison if the word is already present in first or second array.

function checkValidity(enteredWord) {
    var fullWordList1 = new Array("AAH","AAL","AAS","ABA","ABB","ABO","ABS","ABY","ACE","ACH","ACT","ADD","ADO","ADS","ADZ","AFF","AFT","AGA","AGE","AGO","AGS","AHA","AHI","AHS","AIA","AID","AIL","AIM","AIN","AIR","AIS","AIT","AKA","AKE","ALA","ALB","ALE","ALF","ALL","ALP","ALS","ALT","AMA","AMI","AMP","AMU","ANA","AND","ANE","ANI","ANN","ANT","ANY","APE","APO","APP","APT","ARB","ARC","ARD","ARE","ARF","ARK","ARM","ARS","ART","ARY","ASH","ASK","ASP","ASS","ATE","ATT","AUA","AUE","AUF","AUK","AVA","AVE","AVO","AWA","AWE","AWL","AWN","AXE","AYE","AYS","AYU","AZO","BAA","BAC","BAD","BAG","BAH","BAL","BAM","BAN","BAP","BAR","BAS","BAT","BAY","BED","BEE","BEG","BEL","BEN","BES","BET","BEY","BEZ","BIB","BID","BIG","BIN","BIO","BIS","BIT","BIZ","BOA","BOB","BOD","BOG","BOH","BOI","BOK","BON","BOO","BOP","BOR","BOS","BOT","BOW","BOX","BOY","BRA","BRO","BRR","BRU","BUB","BUD","BUG","BUM","BUN","BUR","BUS","BUT","BUY","BYE","BYS","CAA","CAB","CAD","CAG","CAM","CAN","CAP","CAR","CAT","CAW","CAY","CAZ","CEE","CEL","CEP","CHA","CHE","CHI","CID","CIG","CIS","CIT","CLY","COB","COD","COG","COL","CON","COO","COP","COR","COS","COT","COW","COX","COY","COZ","CRU","CRY","CUB","CUD","CUE","CUM","CUP","CUR","CUT","CUZ","CWM","DAB","DAD","DAE","DAG","DAH","DAK","DAL","DAM","DAN","DAP","DAS","DAW","DAY","DEB","DEE","DEF","DEG","DEI","DEL","DEN","DEV","DEW","DEX","DEY","DIB","DID","DIE","DIF","DIG","DIM","DIN","DIP","DIS","DIT","DIV","DOB","DOC","DOD","DOE","DOF","DOG","DOH","DOL","DOM","DON","DOO","DOP","DOR","DOS","DOT","DOW","DOY","DRY","DSO","DUB","DUD","DUE","DUG","DUH","DUI","DUN","DUO","DUP","DUX","DYE","DZO","EAN","EAR","EAS","EAT","EAU","EBB","ECH","ECO","ECU","EDH","EDS","EEK","EEL","EEN","EFF","EFS","EFT","EGG","EGO","EHS","EIK","EKE","ELD","ELF","ELK","ELL","ELM","ELS","ELT","EME","EMO","EMS","EMU","END","ENE","ENG","ENS","EON","ERA","ERE","ERF","ERG","ERK","ERN","ERR","ERS","ESS","EST","ETA","ETH","EUK","EVE","EVO","EWE","EWK","EWT","EXO","EYE","FAA","FAB","FAD","FAE","FAG","FAH","FAN","FAP","FAR","FAS","FAT","FAW","FAX","FAY","FED","FEE","FEG","FEH","FEM","FEN","FER","FES","FET","FEU","FEW","FEY","FEZ","FIB","FID","FIE","FIG","FIL","FIN","FIR","FIT","FIX","FIZ","FLU","FLY","FOB","FOE","FOG","FOH","FON","FOP","FOR","FOU","FOX","FOY","FRA","FRO","FRY","FUB","FUD","FUG","FUM","FUN","FUR","GAB","GAD","GAE","GAG","GAL","GAM","GAN","GAP","GAR","GAS","GAT","GAU","GAY","GED","GEE","GEL","GEM","GEN","GEO","GET","GEY","GHI","GIB","GID","GIE","GIF","GIG","GIN","GIO","GIP","GIS","GIT","GJU","GNU","GOA","GOB","GOD","GOE","GON","GOO","GOR","GOS","GOT","GOV","GOX","GOY","GUB","GUE","GUL","GUM","GUN","GUP","GUR","GUS","GUT","GUV","GUY","GYM","GYP","HAD","HAE","HAG","HAH","HAJ","HAM","HAN","HAO","HAP","HAS","HAT","HAW","HAY","HEH","HEM","HEN","HEP","HER","HES","HET","HEW","HEX","HEY","HIC","HID","HIE","HIM","HIN","HIP","HIS","HIT","HMM","HOA","HOB","HOC","HOD","HOE","HOG","HOH","HOI","HOM","HON","HOO","HOP","HOS","HOT","HOW","HOX","HOY","HUB","HUE","HUG","HUH","HUI","HUM","HUN","HUP","HUT","HYE","HYP","ICE","ICH","ICK","ICY","IDE","IDS","IFF","IFS","IGG","ILK","ILL","IMP","INK","INN","INS","ION","IOS","IRE","IRK","ISH","ISM","ISO","ITA","ITS","IVY","IWI","JAB","JAG","JAI","JAK","JAM","JAP","JAR","JAW","JAY","JEE","JET","JEU","JEW","JIB","JIG","JIN","JIZ","JOB","JOE","JOG","JOL","JOR","JOT","JOW","JOY","JUD","JUG","JUN","JUS","JUT","KAB","KAE","KAF","KAI","KAK","KAM","KAS","KAT","KAW","KAY","KEA","KEB","KED","KEF","KEG","KEN","KEP","KET","KEX","KEY","KHI","KID","KIF","KIN","KIP","KIR","KIS","KIT","KOA","KOB","KOI","KON","KOP","KOR","KOS","KOW","KUE","KYE","KYU","LAB","LAC","LAD","LAG","LAH","LAM","LAP","LAR","LAS","LAT","LAV","LAW","LAX","LAY","LEA","LED","LEE","LEG","LEI","LEK","LEP","LES","LET","LEU","LEV","LEW","LEX","LEY","LEZ","LIB","LID","LIE","LIG","LIN","LIP","LIS","LIT","LOB","LOD","LOG","LOO","LOP","LOR","LOS","LOT","LOU","LOW","LOX","LOY","LUD","LUG","LUM","LUR","LUV","LUX","LUZ","LYE","LYM","MAA","MAC","MAD","MAE","MAG","MAK","MAL","MAM","MAN","MAP","MAR","MAS","MAT","MAW","MAX","MAY","MED","MEE","MEG","MEL","MEM","MEN","MES","MET","MEU","MEW","MHO","MIB","MIC","MID","MIG","MIL","MIM","MIR","MIS","MIX","MIZ","MNA","MOA","MOB","MOC","MOD","MOE","MOG","MOI","MOL","MOM","MON","MOO","MOP","MOR","MOS","MOT","MOU","MOW","MOY","MOZ","MUD","MUG","MUM","MUN","MUS","MUT","MUX","MYC","NAB","NAE","NAG","NAH","NAM","NAN","NAP","NAS","NAT","NAW","NAY","NEB","NED","NEE","NEF","NEG","NEK","NEP","NET","NEW","NIB","NID","NIE","NIL","NIM","NIP","NIS","NIT","NIX","NOB","NOD","NOG","NOH","NOM","NON","NOO","NOR","NOS","NOT","NOW","NOX","NOY","NTH","NUB","NUN","NUR","NUS","NUT","NYE","NYS","OAF","OAK","OAR","OAT","OBA","OBE","OBI","OBO","OBS","OCA","OCH","ODA","ODD","ODE","ODS","OES","OFF","OFT","OHM","OHO","OHS","OIK","OIL","OKA","OKE","OLD","OLE","OLM","OMS","ONE","ONO","ONS","ONY","OOF","OOH","OOM","OON","OOP","OOR","OOS","OOT","OPE","OPS","OPT","ORA","ORB","ORC","ORD","ORE","ORF","ORS","ORT","OSE","OUD","OUK","OUP","OUR","OUS","OUT","OVA","OWE","OWL","OWN","OWT","OXO","OXY","OYE","OYS","PAC","PAD","PAH","PAL","PAM","PAN","PAP","PAR","PAS","PAT","PAV","PAW","PAX","PAY","PEA","PEC","PED","PEE","PEG","PEH","PEN","PEP","PER","PES","PET","PEW","PHI","PHO","PHT","PIA","PIC","PIE","PIG","PIN","PIP","PIR","PIS","PIT","PIU","PIX","PLU","PLY","POA","POD","POH","POI","POL","POM","POO","POP","POS","POT","POW","POX","POZ","PRE","PRO","PRY","PSI","PST","PUB","PUD","PUG","PUH","PUL","PUN","PUP","PUR","PUS","PUT","PUY","PYA","PYE","PYX","QAT","QIS","QUA","RAD","RAG","RAH","RAI","RAJ","RAM","RAN","RAP","RAS","RAT","RAW","RAX","RAY","REB","REC","RED","REE","REF","REG","REH","REI","REM","REN","REO","REP","RES","RET","REV","REW","REX","REZ","RHO","RHY","RIA","RIB","RID","RIF","RIG","RIM","RIN","RIP","RIT","RIZ","ROB","ROC","ROD","ROE","ROK","ROM","ROO","ROT","ROW","RUB","RUC","RUD","RUE","RUG","RUM","RUN","RUT","RYA","RYE","SAB","SAC","SAD","SAE","SAG","SAI","SAL","SAM","SAN","SAP","SAR","SAT","SAU","SAV","SAW","SAX","SAY","SAZ","SEA","SEC","SED","SEE","SEG","SEI","SEL","SEN","SER","SET","SEW","SEX","SEY","SEZ","SHA","SHE","SHH","SHY","SIB","SIC","SIF","SIK","SIM","SIN","SIP","SIR","SIS","SIT","SIX","SKA","SKI","SKY","SLY","SMA","SNY","SOB","SOC","SOD","SOG","SOH","SOL","SOM","SON","SOP","SOS","SOT","SOU","SOV","SOW","SOX","SOY","SPA","SPY","SRI","STY","SUB","SUD","SUE","SUI","SUK","SUM","SUN","SUP","SUQ","SUR","SUS","SWY","SYE","SYN","TAB","TAD","TAE","TAG","TAI","TAJ","TAK","TAM","TAN","TAO","TAP","TAR","TAS","TAT","TAU","TAV","TAW","TAX","TAY","TEA","TEC","TED","TEE","TEF","TEG","TEL","TEN","TES","TET","TEW","TEX","THE","THO","THY","TIC","TID","TIE","TIG","TIL","TIN","TIP","TIS","TIT","TIX","TOC","TOD","TOE","TOG","TOM","TON","TOO","TOP","TOR","TOT","TOW","TOY","TRY","TSK","TUB","TUG","TUI","TUM","TUN","TUP","TUT","TUX","TWA","TWO","TWP","TYE","TYG","UDO","UDS","UEY","UFO","UGH","UGS","UKE","ULE","ULU","UMM","UMP","UMU","UNI","UNS","UPO","UPS","URB","URD","URE","URN","URP","USE","UTA","UTE","UTS","UTU","UVA","VAC","VAE","VAG","VAN","VAR","VAS","VAT","VAU","VAV","VAW","VEE","VEG","VET","VEX","VIA","VID","VIE","VIG","VIM","VIN","VIS","VLY","VOE","VOL","VOR","VOW","VOX","VUG","VUM","WAB","WAD","WAE","WAG","WAI","WAN","WAP","WAR","WAS","WAT","WAW","WAX","WAY","WEB","WED","WEE","WEM","WEN","WET","WEX","WEY","WHA","WHO","WHY","WIG","WIN","WIS","WIT","WIZ","WOE","WOF","WOG","WOK","WON","WOO","WOP","WOS","WOT","WOW","WOX","WRY","WUD","WUS","WYE","WYN","XIS","YAD","YAE","YAG","YAH","YAK","YAM","YAP","YAR","YAW","YAY","YEA","YEH","YEN","YEP","YES","YET","YEW","YEX","YGO","YID","YIN","YIP","YOB","YOD","YOK","YOM","YON","YOS","YOU","YOW","YUG","YUK","YUM","YUP","YUS","ZAG","ZAP","ZAS","ZAX","ZEA","ZED","ZEE","ZEK","ZEL","ZEP","ZEX","ZHO","ZIG","ZIN","ZIP","ZIT","ZIZ","ZOA","ZOL","ZOO","ZOS","ZUZ","ZZZ");
    
    
     
    if(fullWordList1.includes(enteredWord)){
        return 1;
    } else {
        return 0;
    }
  }

  /* function checkValidity(enteredString) {
      var baseURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
      debugger;
      alert(baseURL+enteredString);
      const userAction = async () => {
      const response = await fetch(baseURL+enteredString);
      const myJson = await response.json(); //extract JSON from the http response
      
      alert(myJson);

      return 0;


      }
    }

    function checkWord(enteredString) {
      debugger;
      var URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"+enteredString;

      var   responseTxt = '';

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          responseTxt = JSON.parse(this.responseText);
          alert(responseTxt.toString());
        }
      };
      xhttp.open("GET", URL, true);
      xhttp.send();

      return responseTxt;
    }


    async function fetchText(enteredString) {
    debugger;
    var URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"+enteredString;
    let response = await fetch(URL);

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.text();
        alert(data);
    }

    return 0;
    } */


