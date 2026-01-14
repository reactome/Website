/*
    This script powers the citation functionality on the Joomla website

    To have the citation button `visible` on a new page, add the `Cite Us` module to that particular page from Joomla admin dashboard

    To control which citation appears on which page, the `CITATIONS` object is used alongside the variables with the matching regex

    For example, to add a new citation `foo` which will appear on all pages where the url contains the string `bar`:

    1) add FOO_CITATION: {id: <citation id>, fallback: <fallback citation text in case our query fails>} to CITATIONS constant
    2) create a new variable fooCitation = [/bar/], with the (list of) matching regexes to display FOO_CITATION
    3) add the appropriate condition in parseURL function
*/



// constants declaration
var BASE_URL = window.location.origin;

// the various endpoints we query
var PATHWAY_CITATION_ENDPOINT = "/ContentService/citation/pathway/";
var DOWNLOAD_CITATION_ENDPOINT = "/ContentService/citation/download/";
var STATIC_CITATION_ENDPOINT = "/ContentService/citation/static/";
var EXPORT_CITATION_ENDPOINT = "/ContentService/citation/export?";
var CONTENT_SERVICE_QUERY_ENDPOINT = "/ContentService/data/query/";
var CONTENT_SERVICE_QUERY_ATTRIBUTE = "/schemaClass";

// we cam query pathway and static citations to get 
// vanilla text or to export them in bib, ris or txt formats
var QUERY_MODES = {
    EXPORT: "export",
    TEXT: "text"
}

// export formats
var EXPORT_FORMATS = {
    BIBTEX: "bib",
    TEXT: "txt",
    RIS: "ris"
};


// the request-response cycle for static citations
// for both exporting and getting as text
var STATIC_CITATION_REQUEST_RESPONSE = {
    export : {
        callFunction: function(citation, ext) {
            var d = jQuery.get(BASE_URL.concat(EXPORT_CITATION_ENDPOINT, jQuery.param({id:citation["id"], ext: ext, isPathway: "false", dateAccessed: new Date().toDateString()})))
                    .then(function(response) {
                        downloadFile(response, ext, "reactome_citation_".concat(citation["id"],".",ext));
                    })
            return d;
        }
    },
    text: {
        callFunction: function(citation) {
            var d = jQuery.get(BASE_URL.concat(STATIC_CITATION_ENDPOINT, citation["id"]))
                    .then(
                        function(response) {
                            return response;
                        },
                        function() {
                            return citation["fallback"];
                        }
                    )
            return d;
        }
    }
}

// the request-response cycle for pathway citations
// for both exporting and getting as text
var PATHWAY_CITATION_REQUEST_RESPONSE = {
    export: {
        callFunction: function(id, ext) {
            var d = jQuery.get(BASE_URL.concat(EXPORT_CITATION_ENDPOINT, jQuery.param({id:id, ext: ext, isPathway: "true", dateAccessed: new Date().toDateString()})))
                    .then(function(response) {
                        downloadFile(response, ext, "reactome_citation_".concat(id,".",ext));
                    })
            return d;
        }    
    },
    text: {
        callFunction: function(id) {
            var d = jQuery.get(BASE_URL.concat(PATHWAY_CITATION_ENDPOINT, id, "?", jQuery.param({dateAccessed: new Date().toDateString()})))
                    .then(function(response) {

                        var citation = "";
                        if (response) {
                            var pathwayCitation = "<h5 style='font-weight:bold'>Pathway Citation: </h5>".concat(response["pathwayCitation"]);
                            var imageCitation =  "<h5 style='font-weight:bold'>Image Citation: </h5>".concat(response["imageCitation"]);
                            citation = pathwayCitation.concat("\n", imageCitation);
                        }
                        else {
                            citation = "Not a pathway"
                        }

                        return citation;
            })
        return d;
        }
    }
}

// note that all fallbacks are texts from the `Citing Us` page
// that is except for the ORCID_CITATION fallback, as we don't have a citation for that on the `Citing Us` page. The fallback citation for that was taken from Europe PMC (http://europepmc.org/article/MED/31802127)
var CITATIONS = {
    GENERAL_CITATION: {id: "41251150", fallback: "Ragueneau E, Gong C, Sinquin P, Sevilla C, Beavers D, Grentner A, Griss J, Hogue GFJ, Li NT, Matthews L, May B, Milacic M, Mohammadi H, Petryszak R, Rothfels K, Shamovsky V, Stephan R, Tiwari K, Weiser J, Wright A, Gillespie M, Wu G, Stein L, Hermjakob H, D'Eustachio P. The Reactome Knowledgebase 2026. Nucleic Acids Res. 2025 Nov 18:gkaf1223. doi: 10.1093/nar/gkaf1223. Epub ahead of print. PMID: 41251150."},
    ICON_CITATION: {id: "29077811", fallback: "Sidiropoulos K, Viteri G, Sevilla C, Jupe S, Webber M, Orlic-Milacic M, Jassal B, May B, Shamovsky V, Duenas C, Rothfels K, Matthews L, Song H, Stein L, Haw R, D'Eustachio P, Ping P, Hermjakob H, Fabregat A. Reactome enhanced pathway visualization. Bioinformatics. 2017 Nov 1;33(21):3461-3467. doi: 10.1093/bioinformatics/btx441. PubMed PMID: 29077811"},
    PATHWAY_ANALYSIS_CITATION: {id: "28249561", fallback: "Fabregat A, Sidiropoulos K, Viteri G, Forner O, Marin-Garcia P, Arnau V, D'Eustachio P, Stein L, Hermjakob H. Reactome pathway analysis: a high-performance in-memory approach. BMC Bioinformatics. 2017 Mar 2;18(1):142. doi: 10.1186/s12859-017-1559-2. PubMed PMID: 28249561"},
    FIVIZ_CITATION: {id: "28150241", fallback: "Wu G, Haw R. Functional Interaction Network Construction and Analysis for Disease Discovery. Methods Mol Biol. 2017;1558:235-253. doi: 10.1007/978-1-4939-6783-4_11. PubMed PMID: 28150241"},
    GSA_CITATION: {id: "PPR152409", fallback: "Griss J, Viteri G, Sidiropoulos K, et al. ReactomeGSA - Efficient Multi-Omics Comparative Pathway Analysis. bioRxiv; 2020. DOI: 10.1101/2020.04.16.044958."},
    GRAPH_DATABASE_CITATION: {id: "29377902", fallback: "Fabregat A, Korninger F, Viteri G, Sidiropoulos K, Marin-Garcia P, Ping P, Wu G, Stein L, D'Eustachio P, Hermjakob H. Reactome graph database: Efficient accessto complex pathway data. PLoS Comput Biol. 2018 Jan 29;14(1):e1005968. doi: 10.1371/journal.pcbi.1005968. eCollection 2018 Jan. PubMed PMID: 29377902"},
    ORCID_CITATION: {id: "31802127", fallback: "Viteri G, Matthews L, Varusai T, et al. Reactome and ORCID-fine-grained credit attribution for community curation. Database : the Journal of Biological Databases and Curation. 2019 Jan;2019 DOI: 10.1093/database/baz123"}
}

// the regex that must be matched to show the relevant citation
// so for example `ORCID_CITATION` will be used when the page url matches the regex(es) in `orcidCitation`
var generalCitation = [/what-is-reactome/, /about/, /sab/, /license/, /community/]; 
var downloadCitation = [/download-data/];
var iconCitation = [/icon-lib/, /R-ICO/]; 
var pathwayAnalysisCitation = [/AnalysisService/]; 
var fivizCitation = [/reactome-fiviz/]; 
var gsaCitation = [/reactome-gsa/, /gsa/];
var graphDatabaseCitation = [/ContentService/, /graph-database/];
var pathwayCitation = [/content\/detail\/R-/];
var orcidCitation = [/orcid/, /contributors/];

// constants declaration end


// event based work:
jQuery(document).ready(function() {

    // instantiating the clipboard button here
    var clipboard = new ClipboardJS('#clipboardButton', {
        container: jQuery('#citationModal').find("#citationText")
    });

    var clipboardButton = jQuery('#clipboardButton');

    clipboard.on('success', function(e) {
        clipboardButton.find("i").removeClass("fa fa-clipboard").addClass("fa fa-check");
        clipboardButton.attr("disabled", true);

        // clears selection and changes icon back to the copy icon after 2 seconds have passed
        setTimeout(function() {
            clipboardButton.attr("disabled", false);
            clipboardButton.find("i").removeClass("fa fa-check").addClass("fa fa-clipboard");

            e.clearSelection();
        }, 2000);
    });

    clipboard.on('error', function(e) {
        console.error("Whoops.Couldn't copy");
    });

    // showing the backtop button again after the modal closes
    jQuery("#citationModal").on("hidden.bs.modal", function (e) {
        jQuery("#fav-backtop").css("right", "" ).css("left", "" );

    });

    // hiding the backtop button after the modal opens
    jQuery("#citationModal").on("show.bs.modal", function (e) {
        jQuery("#fav-backtop").css("right", "-1000em" ).css("left", "-1000em");

    });

});

// functions being called from the html file

//main method that gets called when the modal button is clicked
function getCitation() {
    var modal = jQuery("#citationModal");
    // passing the current page url to parseURL which will give us a citation promise 
    // that we can resolve
    var d = parseURL(url=window.location.href, mode=QUERY_MODES["TEXT"]);

    d.then(
        // on success
        function(citation) {
            // clearing any radio button selection before modal gets opened
            jQuery("input[name=exportOption]:checked").prop("checked", false);
            // disabling export buttons
            modal.find("#exportCitationButton")[0].disabled = true;
            modal.modal("show");
            modal.find("#citationText").html(citation);
        },
        // on failure
        function(failure) {
            // hide the copy to clipboard and mail buttons
            modal.find("#clipboardButton").hide();
            modal.find("#mailButton").hide();
            hideExportSection();
            // make warning alert visible
            modal.find("#citationWarning").show();
            modal.modal('show');

            if (!failure) {
                // make `help@reactome.org` a mailto link
                var helpEmail = jQuery("<a />");
                helpEmail.attr("href", "mailto:help@reactome.org");
                helpEmail.text("help@reactome.org");
                modal.find("#citationText").text("Sorry, we could not process your request. Please email the issue to ").append(helpEmail);
            }
            else {
                modal.find("#citationText").text(failure);
            }            
        }
    );
}

// handles the mail-to functionality
function sendMail() {
    window.location = "mailto:?subject=Reactome Citation&body=" + encodeURIComponent(jQuery('#citationModal').find("#citationText").text());
}


// exports the citation in the selected format
function exportCitation() {

    var exportFormat = jQuery("input[name=exportOption]:checked", "#exportCitationForm").val();

    if (!exportFormat) {
        return;
    }

     var modal = jQuery('#citationModal');
     var d =  parseURL(url=window.location.href, mode=QUERY_MODES["EXPORT"], exportFormat);
}


// enables the export citation button when one of the citation formats is selected
function enableExportCitationButton() {
    jQuery("#citationModal").find("#exportCitationButton")[0].disabled = false;
 }

// functions being called from html end


// function that does the heavy lifting of figuring out which page we are on,
// and returning the appropriate citation promise
function parseURL(url, mode, ext= EXPORT_FORMATS["TEXT"]) {
    if (generalCitation.some(function(regex) {return regex.test(url)})) {
        return getStaticCitation(CITATIONS["GENERAL_CITATION"], mode, ext);
    }

    else if (downloadCitation.some(function(regex) {return regex.test(url)})) {
        hideExportSection();
        return getDownloadCitation();

    }

    else if (iconCitation.some(function(regex) {return regex.test(url)})) {
        return getStaticCitation(CITATIONS["ICON_CITATION"]
            , mode, ext);
    }

    else if (pathwayAnalysisCitation.some(function(regex) {return regex.test(url)})) {
        return getStaticCitation(CITATIONS["PATHWAY_ANALYSIS_CITATION"], mode, ext);
    }

    else if (fivizCitation.some(function(regex) {return regex.test(url)})) {
        return getStaticCitation(CITATIONS["FIVIZ_CITATION"], mode, ext);
    }
  
   else if (gsaCitation.some(function(regex) {return regex.test(url)})) {
        return getStaticCitation(CITATIONS["GSA_CITATION"], mode, ext);
    }

    else if (graphDatabaseCitation.some(function(regex) {return regex.test(url)})) {
        return getStaticCitation(CITATIONS["GRAPH_DATABASE_CITATION"], mode, ext);
    }

    else if (orcidCitation.some(function(regex) {return regex.test(url)})) {
        return getStaticCitation(CITATIONS["ORCID_CITATION"], mode, ext);
    }

    else if (pathwayCitation.some(function(regex) {return regex.test(url)})) {

        var pathwayStId = window.location.href.split("/").pop();
        return jQuery.get(BASE_URL.concat(CONTENT_SERVICE_QUERY_ENDPOINT, pathwayStId, CONTENT_SERVICE_QUERY_ATTRIBUTE)).then(
            function(response) {
                if (response.toLowerCase().indexOf("pathway") != -1) {
                    // return the promise for pathway citation
                    return getPathwayCitation(pathwayStId, mode, ext);
                }
                else { 
                    // return promise for general citation
                    return getStaticCitation(CITATIONS["GENERAL_CITATION"], mode, ext);

                }
            });
    }

    // default case
    else {
        return getStaticCitation(CITATIONS["GENERAL_CITATION"], mode, ext);
    }
}


// helper functions


function getStaticCitation(citation, mode, ext= EXPORT_FORMATS["TEXT"]) {
    if (mode === QUERY_MODES["EXPORT"]) {
        return STATIC_CITATION_REQUEST_RESPONSE[mode]["callFunction"](citation, ext);
    }
    else {
         return STATIC_CITATION_REQUEST_RESPONSE[mode]["callFunction"](citation);
    }
}

function getPathwayCitation(id, mode, ext= EXPORT_FORMATS["TEXT"]) {
    if (mode === QUERY_MODES["EXPORT"]) {
        return PATHWAY_CITATION_REQUEST_RESPONSE[mode]["callFunction"](id, ext);
    }
    else {
         return PATHWAY_CITATION_REQUEST_RESPONSE[mode]["callFunction"](id);
    }
}

function getDownloadCitation() {
    var d = jQuery.get(BASE_URL.concat(DOWNLOAD_CITATION_ENDPOINT)).then(function(response) { return response + " (" + new Date().toDateString() + ")";})
    return d;
}

// download file code taken from here: https://stackoverflow.com/a/33542499/3240056 and https://stackoverflow.com/a/9834261/3240056
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

function hideExportSection(modal) {
    var modal = jQuery("#citationModal");
    // hide the line break before the export form
    modal.find("#breakLine").hide();
    // hide the export form as well
    jQuery("#exportCitationForm").hide();
}

// helper functions end


