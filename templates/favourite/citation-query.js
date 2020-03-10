//TO-DO:
// refactor code so that the dom indentifiers are less generic
// work on the CSS, mode code from html to proper style sheets

// constants declaration
var EUROPE_PMC_BASE_URL = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?";
var EUROPE_PMC_QUERY_MODES = {
    EXPORT: "export",
    TEXT: "text"
}
var EUROPE_PMC_REQUEST_RESPONSE = {
    // for the export functionality of the citations we querying Europe PMC's api with format `json` and 
    // resultType `core` so that we get all the data, specifically so that we get the author names
    // in full detail
    export : {
        format: "json",
        resultType: "core",
        parseResponse: function(response) {return response["resultList"]["result"][0];}
    },

    // for the textual citation, we are querying Europe PMC's api with format `dc` so to get citation related metadata
    // and use the `dcterms:bibliographicCitation` tag
    // the `dc` format by default uses `resultType` = `core`. I specified that here for clarity
    text: {
        format: "dc",
        resultType: "core",
        parseResponse: function(response) {return response.getElementsByTagName("dcterms:bibliographicCitation")[0].childNodes[0].nodeValue;}
    }
}

var PATHWAY_CITATION_REQUEST_RESPONSE = {
    export: {
        parseResponse: function(response) {return response;}
    },
    text: {
        parseResponse: function(response) {
            var windowLocation = window.location;
            var authors = response["authors"].map(function(author) {
                return author["lastName"] + "," + " " +  author["initials"];
            });
            // checking that authors key exists, the value is not undefined or null and the list is not empty
            var authorCitation = "";

            if (authors && authors.length > 0) {
                authorCitation = authors[authors.length-1];

                if (authors.length > 1) {
                    authors.slice(0, authors.length-1).join(" , ").concat(" & ", authorCitation);
                }

            }
            else {
                authorCitation = "The Reactome Consortium";
            }



            var doi = response["doi"];
            // checking that doi key exists and the value is not undefined or null 
            var urls = doi ? [windowLocation.href, DOI_BASE_URL.concat(doi)] : [windowLocation.href];

            var dateOfAccess = new Date().toDateString();
            var commonCitation = response["pathwayTitle"].concat(". Reactome, ",  response["releaseVersion"], ", ", urls.join(", ")," (", dateOfAccess, ")");
            var pathwayCitation = "Pathway Citation".concat(": ", authorCitation, " (", response["publicationYear"], "). ",  commonCitation);
            var imageCitation =  "Image Citation".concat(": Image Citation for ", commonCitation);

            // line break not working
            return pathwayCitation.concat("\n", imageCitation);
        }
    }
}

var DOI_BASE_URL = "https://doi.org/"
var PATHWAY_CITATION_ENDPOINT = "/ContentService/citation/pathway/";
var QUERY_ENDPOINT = "/ContentService/data/query/";
var QUERY_ATTRIBUTE = "/schemaClass";
var DOWNLOAD_CITATION_ENDPOINT = "/ContentService/citation/download/";


var GENERAL_CITATION_ID = 31691815
var ICON_CITATION_ID = 29077811
var PATHWAY_ANALYSIS_CITATION_ID = 28249561
var FIVIZ_CITATION_ID = 28150241
var GRAPH_DATABASE_CITATION_ID = 29377902

// export formats
var EXPORT_FORMATS = {
    BIBTEX: {fileExt: "bib", mimeType: "application/x-bibtex", web: "misc", journal: "article"},
    TEXT: {fileExt: "txt", mimeType: "text/plain"},
    // for pathways, the Type in the RIS files ahas been set as `ELEC`, and the type for static citations
    //has been set as 
    RIS: {fileExt: "ris", mimeType: "application/x-research-info-systems", web: "ELEC", journal: "JOUR"}
};


// constants declaration end

var generalCitation = [/what-is-reactome/, /about/, /sab/, /license/, /orcid/, /community/]; 
var downloadCitation = [/download-data/];
var iconCitation = [/icon-lib/, /R-ICO/]; 
var pathwayAnalysisCitation = [/AnalysisService/]; 
var fivizCitation = [/reactome-fiviz/]; 
var graphDatabaseCitation = [/ContentService/, /graph-database/];
var pathwayCitation = [/content\/detail\/R-/];


// event based work:
jQuery(document).ready(function() {

    // instantiating the clipboard button here
    var clipboard = new ClipboardJS('#clipboardButton', {
        container: jQuery('#myModal').find(".modal-body").find("#citationText")
    });

    var clipboardButton = jQuery('#clipboardButton');

    clipboard.on('success', function(e) {
        clipboardButton.find("i").removeClass("fa fa-clipboard").addClass("fa fa-check");
        clipboardButton.attr("disabled", true);

        // clears selection and changes icon back to the copy icon after 2 seconds have passed
        setTimeout(function() {
            clipboardButton.attr("disabled", false);
            // clipboardButton.find("i").removeClass("fas fa-check").addClass("fas fa-copy");
            clipboardButton.find("i").removeClass("fa fa-check").addClass("fa fa-clipboard");

            e.clearSelection();
        }, 2000);
    });

    clipboard.on('error', function(e) {
        console.error("Whoops.Couldn't copy");
    });
});

// functions being called from the html file

/* main method that gets called when the modal button is clicked
event order:
    1) someone clicks on the button
    2) we check what page we are on
    3) we call the appropriate function to get citation data
*/
function getCitation() {
    var modal = jQuery('#myModal');
    // passing the current page url to parseURL which will give us a citation promise 
    // that we can resolve
    var d = parseURL(url=window.location.href, mode=EUROPE_PMC_QUERY_MODES["TEXT"]);

    d.then(
        // on success
        function(citation) {
            // clearing any radio button selection before modal gets opened
            jQuery("input[name=exportOption]:checked").prop("checked", false); 
            modal.modal("show");
            modal.find(".modal-body").find("#citationText").text(citation);
        },
        // on failure
        function() {
            // hide the copy to clipboard and mail buttons
            modal.find(".modal-header").find("#clipboardButton").hide();
            modal.find(".modal-header").find("#mailButton").hide();
            modal.modal('show');
            // make `help@reactome.org` a mailto link
            var helpEmail = jQuery("<a />");
            helpEmail.attr("href", "mailto:help@reactome.org");
            helpEmail.text("help@reactome.org");
            // show the error message
            modal.find(".modal-body").find("#citationText").text("Sorry, we could not process your request. Please email the error code to ").append(helpEmail);
        }
    );
}

// handles the mail-to functionality
function sendMail() {
    window.location = "mailto:?subject=Reactome Citation&body=" + encodeURIComponent(jQuery('#myModal').find('.modal-body').find("#citationText").text());
}


// exports the citation in the selected format
function exportCitation() {

    var exportFormat = jQuery("input[name=exportOption]:checked", "#exportCitationForm").val();
    var filename = "reactome_citation." + exportFormat;
    var data = "This is a Reactome Citation"; // putting in a default citation

    if (!exportFormat) {
        return;
    }

    var modal = jQuery('#myModal');
    // passing the current page url to parseURL which will give us a citation promise 
    // that we can resolve
    var d = parseURL(url=window.location.href, mode=EUROPE_PMC_QUERY_MODES["EXPORT"]);
    d.then(
    //on success
        function(citation) {
            switch(exportFormat) {
                case EXPORT_FORMATS["BIBTEX"]["fileExt"]:
                    data = convertJSONToBibTeX(preprocessForExport(citation));
                    downloadFile(data, format=EXPORT_FORMATS["BIBTEX"]["mimeType"], filename);
                    break;
                case EXPORT_FORMATS["RIS"]["fileExt"]:
                    data = convertJSONToRIS(preprocessForExport(citation));
                    downloadFile(data, format=EXPORT_FORMATS["RIS"]["mimeType"], filename);
                    break;
                default:
                    data = jQuery('#myModal').find(".modal-body").find("#citationText").text();
                    downloadFile(data, format=exportFormat, filename);
            }
        });
}


// enables the export citation button when one of the citation formats is selected
function enableExportCitationButton() {
    jQuery("#myModal").find(".modal-body").find("#exportCitationForm").find("#exportCitationButton")[0].disabled = false;
    // refactor code so that so that a custom css class can get made for disabled and enabled buttons
    //jQuery("#myModal").find(".modal-body").find("#exportCitationForm").find("#exportCitationButton")[0].style["cursor"] = "default";
   
}

// functions being called from html end


// function that does the heavy lifting of figuring out which page we are on,
// and returning the approriate citation promise
function parseURL(url, mode) {
    if (generalCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, GENERAL_CITATION_ID, mode);
    }

    else if (downloadCitation.some(function(regex) {return regex.test(url)})) {
        document.getElementById("exportCitationForm").style.display="none";
        var d = jQuery.get(window.location.origin.concat(DOWNLOAD_CITATION_ENDPOINT)).then(function(response) { return response + " (" + new Date().toDateString() + ")";})
        return d;

    }

    else if (iconCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, ICON_CITATION_ID, mode);
    }

    else if (pathwayAnalysisCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, PATHWAY_ANALYSIS_CITATION_ID, mode);
    }

    else if (fivizCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, FIVIZ_CITATION_ID, mode);
    }

    else if (graphDatabaseCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, GRAPH_DATABASE_CITATION_ID, mode);
    }

    else if (pathwayCitation.some(function(regex) {return regex.test(url)})) {

        var pathwayStId = window.location.href.split("/").pop();
        return jQuery.get(QUERY_ENDPOINT.concat(pathwayStId, QUERY_ATTRIBUTE)).then(
            function(response) {
                if (response.toLowerCase().indexOf("pathway") != -1) {
                    // return the promise for pathway citation
                    return getPathwayCitationObj(PATHWAY_CITATION_ENDPOINT, pathwayStId, mode);
                }
                else { 
                    // return promise for general citation
                    return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, GENERAL_CITATION_ID, mode);
                }
            });
    }

    // default case
    else {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, GENERAL_CITATION_ID, mode);
    }
}


// helper functions

// returns promise with the citation from Europe PMC and how to parse that response
function getCitationFromEuropePMC(baseUrl, searchId, mode) {
     var settings = EUROPE_PMC_REQUEST_RESPONSE[mode];
     var d = jQuery.get(baseUrl.concat(jQuery.param({query:searchId, format: settings["format"],resultType: settings["resultType"]}))).then(settings["parseResponse"]);
     return d;
}


//returns promise with the pathway citation response and how to parse that response
function getPathwayCitationObj(pathwayCitationEndpoint, pathwayStId, mode) {
    var settings = PATHWAY_CITATION_REQUEST_RESPONSE[mode];
    var d = jQuery.get(window.location.origin.concat(pathwayCitationEndpoint, pathwayStId)).then(function(response) {return settings["parseResponse"](response);});
    return d;

}


// takes json, that is either the response from Europe PMC's endpoint or the response from the 
// pathway citation and makes a dictionary that the export functions can use
function preprocessForExport(json) {

    // all the checks here follow the order: are we getting the citation from Europe PMC? or are we getting it from our pathway citation endpoint? citationDetails gets populated accordingly
    var citationDetails = {};
    citationDetails["id"] = json["id"] || json["stid"]; // the id. compulsory field
    citationDetails["title"] = json["title"] || json["pathwayTitle"]; //title of article. compulsory field

    citationDetails["journal"] = ((json["journalInfo"] || {})["journal"] || {})["title"]; 
    citationDetails["year"] = (json["journalInfo"] || {})["yearOfPublication"] || json["publicationYear"]; // publication year. compulsory field
    citationDetails["month"] = (json["journalInfo"] || {})["monthOfPublication"] || json["publicationMonth"]; // publication month
    citationDetails["number"] = (json["journalInfo"] || {})["issue"];
    citationDetails["volume"] = (json["journalInfo"] || {})["volume"]
    citationDetails["issn"] = ((json["journalInfo"] || {})["journal"] || {})["issn"]; // ISSN number
    citationDetails["pages"] = json["pageInfo"]; // pages

    if (json["doi"]) {
        citationDetails["doi"] = json["doi"];
        citationDetails["urls"] = [DOI_BASE_URL.concat(json["doi"])];
    }
    else if (json["stid"])
        citationDetails["urls"] = (citationDetails["urls"]) ? citationDetails.push(window.location.href) : [].push(window.location.href);

    citationDetails["authors"] = (json["authorList"] || {})["author"] || json["authors"] || "The Reactome Consortium"; 
    citationDetails["type"] = (!!json["isPathway"]) ? EXPORT_FORMATS["BIBTEX"]["web"] : EXPORT_FORMATS["BIBTEX"]["journal"];

    return citationDetails;
}


// download file code taken from here: https://stackoverflow.com/a/33542499/3240056
// there are other export options worth evaluating
// browser compaability will have to be more throughly checked
function downloadFile(data, format, filename) {
    var blob = new Blob([data], {type: format});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

// helper functions end


// export functions

// takes a json and converts that to RIS string
// RIS file specs were taken from: 
// https://web.archive.org/web/20100704171416/http://www.refman.com/support/risformat_intro.asp
// https://en.wikipedia.org/wiki/RIS_(file_format)
function convertJSONToRIS(json) {
    var doubleSpace = "  ";
    var space = " ";
    var dash = "-";
    var keyValueSeparator = doubleSpace + dash + space;
    var comma = ",";
    var newline = "\n";

    // start the RIS document
    var ris = "TY" + keyValueSeparator + json["type"] + newline;

    // adding the title
    ris += "TI" + keyValueSeparator + json["title"] + newline

    // adding the authors
    var authorString = "";
    if (json["authors"] instanceof Array) {
        json["authors"].forEach(function(author) {
            authorString += "AU" + keyValueSeparator + 
                            author["lastName"] + comma + space +  (author["firstName"] || author["initials"]) +
                            newline;
        })
    }
    else {
        authorString = json["authors"];
    }
    ris += authorString;


    // adding unique identifiers
    // Accession Number
    ris += "AN" + keyValueSeparator + (json["id"] || json["stid"]) + newline;
    // DOI
    if (json["doi"]) ris += "DO" + keyValueSeparator + json["doi"] + newline;
    // URL
    if (json["urls"] && json["urls"].length != 0) {
        var urlstring = ""
        json["urls"].forEach(function(url){ urlstring += "UR" + keyValueSeparator + url.trim() + newline});
        ris += urlstring;
    } 

    //all the pub time related info
    // publishing year
    ris += "PY" + keyValueSeparator + json["year"] + newline;
    if (json["month"]) ris += "DA" + keyValueSeparator + json["year"] + "/" + json["month"] + "//" + newline;

    // all the journal related fields
    if (json["journal"]) ris += "JO" + keyValueSeparator + json["journal"] + newline;
    if (json["number"]) ris += "IS" + keyValueSeparator + json["number"] + newline;
    if (json["volume"]) ris += "VL" + keyValueSeparator + json["volume"] + newline;
    if (json["issn"]) ris += "SN" + keyValueSeparator + json["issn"] + newline;
    if (json["pages"]) ris += "SP" + keyValueSeparator + json["pages"] + newline;

    // end of RIS document
    ris += "ER" + keyValueSeparator + newline;

    return ris;
} 

// takes a json and converts that into a BibTeX string
// BibTe files specs were taken from:
// LaTeX - User's Guide and Reference Manual-lamport94.pdf, Appendix B
// https://www.economics.utoronto.ca/osborne/latex/BIBTEX.HTM
// https://en.wikipedia.org/wiki/BibTeX
function convertJSONToBibTeX(json) {
    var newline = "\n"
    var openBracket = "{"
    var closeBracket = "}";
    var comma = ","
    var endLine = closeBracket + comma + newline;
    var space = " ";
    var and = "and";

    // start bibtex document
    // IMPORTANT: DISCUSS THE TYPE WRT PATHWAY. WOULD THE TYPE BE ARTICLE FOR PATHWAY AS WELL?
    // https://tex.stackexchange.com/questions/3587/how-can-i-use-bibtex-to-cite-a-web-page
    var bibtex = "@" + json["type"] + openBracket + json["id"] + comma + newline;

    bibtex += "Title = " + openBracket + json["title"] + endLine; // added title

    // prepping author string
    var authorString = "";
    if (json["authors"] instanceof Array) {
        var authors = json["authors"].map(function(author) {
            return author["lastName"] + comma + space +  (author["firstName"] || author["initials"]);
        })

        authorString = authors.join(space + and + space) 
    }
    else {
        authorString = json["authors"];
    }
    
    bibtex += "Author = " + openBracket + authorString + endLine;

    // all the journal related info
    if (json["journal"]) bibtex += "Journal = " + openBracket + json["journal"] + endLine;
    if (json["number"]) bibtex += "Number = " + openBracket + json["number"] + endLine;
    if (json["volume"]) bibtex += "Volume = " + openBracket + json["volume"] + endLine;
    if (json["issn"]) bibtex += "ISSN = " + openBracket + json["issn"] + endLine;
    if (json["pages"]) bibtex += "Pages = " + openBracket + json["pages"] + endLine;

    // all the pub time related info
    bibtex += "Year = " + openBracket + json["year"] + endLine;
    if (json["month"]) bibtex += "Month = " + openBracket + json["month"] + endLine;

    // any unique identifiers
    if (json["doi"]) bibtex += "DOI = " + openBracket + json["doi"] + endLine;
    if (json["urls"] && json["urls"].length != 0) bibtex += "URL = " + openBracket + json["urls"][0] + endLine;

    // end bibtex document
    bibtex += closeBracket;

    return bibtex;
}


