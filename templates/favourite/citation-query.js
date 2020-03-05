
// to-do: write parser for the various URL / URI
// write the endpoint / implement the code for download page and citation page
// implement the copy to clipboard button
// make the modal and button responsive
// finalize the color scheme and stuff
// consider generating the modal programmatically / on call
// implement the email functionality
// I could potentially call and save the citation in one format if the cite-me module exists: https://gomakethings.com/conditionally-loading-javascript-only-when-the-browser-supports-it/#feature-testing
// implement on pathway browser as well


// potentially helpful later: 
// https://deepasp.wordpress.com/2015/10/18/dynamically-creating-and-showing-bootstrap-modal/
// https://www.ovais.me/javascript/bootstrap-3-modal-easy-way/


// to ask -- could use const here, 
var EUROPE_PMC_BASE_URL = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?";
var EUROPE_PMC_RESPONSE_FORMAT = "dc";
var EUROPE_PMC_XML_CITATION_TAG = "dcterms:bibliographicCitation";
var DOI_BASE_URL = " https://doi.org/"
var PATHWAY_CITATION_ENDPOINT = "/ContentService/citation/pathway/";
var QUERY_ENDPOINT = "/ContentService/data/query/";
var QUERY_ATTRIBUTE = "/schemaClass";
var DOWNLOAD_CITATION_ENDPOINT = "/ContentService/citation/download/";


var GENERAL_CITATION_ID = 31691815
var ICON_CITATION_ID = 29077811
var PATHWAY_ANALYSIS_CITATION_ID = 28249561
var FIVIZ_CITATION_ID = 28150241
var GRAPH_DATABASE_CITATION_ID = 29377902


// for your regex needs: https://stackoverflow.com/questions/30114238/match-any-all-of-multiple-words-in-a-string --- good alternative
// this is noice: https://stackoverflow.com/questions/10152650/javascript-match-regular-expression-against-the-array-of-items
// should I stick to an array of regexes or do `or` in regex?
// or use substring ops?
var generalCitation = [/what-is-reactome/, /about/, /sab/, /license/, /orcid/, /community/]; // checked on these pages
var downloadCitation = [/download-data/];
var iconCitation = [/icon-lib/, /R-ICO/]; // checked here
var pathwayAnalysisCitation = [/AnalysisService/]; 
var fivizCitation = [/reactome-fiviz/]; // checked here
var graphDatabaseCitation = [/ContentService/, /graph-database/]; // checked 
var pathwayCitation = [/content\/detail\/R-/];

// analysis service, content service have issues wrt menu modal assignment
// icon-lib acting weirdly

// instantiating the clipboard button here
jQuery(document).ready(function() {
    // refactor this code here
    var clipboard = new ClipboardJS('#clipboardButton', {
        container: jQuery('#myModal')
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
    var d = parseURL(window.location.href);

    d.then(
        // on success
        function(citation) {
            modal.modal('show');
            modal.find('.modal-body').text(citation);
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
            modal.find(".modal-body").text("Sorry, we could not process your request. Please email the error code to ").append(helpEmail);
        }
    );
}


// function that does the heavy lifting of figuring out which page we are on,
// and returning the approriate citation promise
function parseURL(url) {
    if (generalCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, GENERAL_CITATION_ID, EUROPE_PMC_RESPONSE_FORMAT, EUROPE_PMC_XML_CITATION_TAG);
    }

    else if (downloadCitation.some(function(regex) {return regex.test(url)})) {
        var d = jQuery.get(window.location.origin.concat(DOWNLOAD_CITATION_ENDPOINT)).then(function(response) { return response + " (" + new Date().toDateString() + ")";})
        return d;

    }

    else if (iconCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, ICON_CITATION_ID, EUROPE_PMC_RESPONSE_FORMAT, EUROPE_PMC_XML_CITATION_TAG);
    }

    else if (pathwayAnalysisCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, PATHWAY_ANALYSIS_CITATION_ID, EUROPE_PMC_RESPONSE_FORMAT, EUROPE_PMC_XML_CITATION_TAG);
    }

    else if (fivizCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, FIVIZ_CITATION_ID,EUROPE_PMC_RESPONSE_FORMAT, EUROPE_PMC_XML_CITATION_TAG);
    }

    else if (graphDatabaseCitation.some(function(regex) {return regex.test(url)})) {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, GRAPH_DATABASE_CITATION_ID,EUROPE_PMC_RESPONSE_FORMAT, EUROPE_PMC_XML_CITATION_TAG);
    }

    else if (pathwayCitation.some(function(regex) {return regex.test(url)})) {

        var pathwayStId = window.location.href.split("/").pop();
        return jQuery.get(QUERY_ENDPOINT.concat(pathwayStId, QUERY_ATTRIBUTE)).then(
            function(response) {
                if (response.toLowerCase().indexOf("pathway") != -1) {
                    // return the promise for pathway citation
                    return getPathwayCitationObj(PATHWAY_CITATION_ENDPOINT, pathwayStId);
                }
                else { 
                    // return promise for general citation
                    return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, GENERAL_CITATION_ID,EUROPE_PMC_RESPONSE_FORMAT, EUROPE_PMC_XML_CITATION_TAG);
                }
            });
    }

    // default case
    else {
        return getCitationFromEuropePMC(EUROPE_PMC_BASE_URL, GENERAL_CITATION_ID,EUROPE_PMC_RESPONSE_FORMAT, EUROPE_PMC_XML_CITATION_TAG);
    }
}


// helper functions

// returns promise with the citation from Europe PMC and how to parse that response
function getCitationFromEuropePMC(baseUrl, searchId, format, tagName) {
    var d = jQuery.get(baseUrl.concat(jQuery.param({query:searchId, format: format}))).then(function(response) {return response.getElementsByTagName(tagName)[0].childNodes[0].nodeValue;});
    return d;
}


//returns promise with the pathway citation response and how to parse that response
function getPathwayCitationObj(pathwayCitationEndpoint, pathwayStId) {
    var windowLocation = window.location;

    var d = jQuery.get(windowLocation.origin.concat(pathwayCitationEndpoint, pathwayStId)).then(function(response) {
            var authors = response["authors"];
            // checking that authors key exists, the value is not undefined or null and the list is not empty
            var authorCitation = (authors && authors.length != 0) ? authors.slice(0, authors.length-1).join(" , ").concat(" & ", authors[authors.length-1]) : "The Reactome Consortium";

            var doi = response["doi"];
            // checking that doi key exists and the value is not undefined or null 
            var urls = doi ? [windowLocation.href, DOI_BASE_URL.concat(doi)] : [windowLocation.href];

            var dateOfAccess = new Date().toDateString();
            var commonCitation = response["pathwayTitle"].concat(". Reactome, ",  response["releaseVersion"], ", ", urls.join(", ")," (", dateOfAccess, ")");
            var pathwayCitation = "Pathway Citation".concat(": ", authorCitation, " (", response["publicationYear"], "). ",  commonCitation);
            var imageCitation =  "Image Citation".concat(": ", commonCitation);

            // line break not working
            return pathwayCitation.concat("<br/>", imageCitation);
    });

    return d;

}
// helper functions end


// handles the mail-to functionality
function sendMail() {
    window.location = "mailto:?subject=Reactome Citation&body=" + encodeURIComponent(jQuery('#myModal').find('.modal-body').text());
}




