function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Create Documents');
  menu.addItem('Create QD PDF', 'createQds')
  menu.addItem('Create LOC PDF', 'createLocs')
  menu.addItem('Create REQ PDF', 'createReqs')
  menu.addToUi();

}
  

function createQds() {

const docFile= DriveApp.getFileById("15OdxtgsNzpHDPfq9DzUPhouzF3l5z77hlGBbHicd3ys");
const tempFolder = DriveApp.getFolderById("11izJBw_1zT4MUvF-64EEpP-3zZLYSq-8");
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("QD");
const rows = sheet.getDataRange().getValues();

rows.forEach(function(row,index){
    if (index === 0) return;
    if (row[3]=="") return;
    if(row[53]) return;
    
    const copy = docFile.makeCopy(`${row[52]} QD` , tempFolder)
    const doc = DocumentApp.openById(copy.getId())
    const body = doc.getBody();
    const friendlyDate = Utilities.formatDate(new Date(row[2]),SpreadsheetApp.getActive().getSpreadsheetTimeZone(),'dd MMMM, yyyy');
  


    body.replaceText("{appraisal_No}", row[1]);
    body.replaceText("{date}", friendlyDate);
    body.replaceText("{first_name}", row[3]);
    body.replaceText("{last_name}", row[4]);
    body.replaceText("{addr}", row[5]);
    body.replaceText("{sb}", row[6]);
    body.replaceText("{zip}", row[7]);
    body.replaceText("{email}", row[8]);
    body.replaceText("{ph_house}", row[9]);
    body.replaceText("{ph_mob}", row[10]);
    body.replaceText("{spoke_about}", row[11]);
    body.replaceText("{areas_1}", row[12]);
    body.replaceText("{areas_2}", row[13]);
    body.replaceText("{areas_3}", row[14]);
    body.replaceText("{areas_4}", row[15]);
    body.replaceText("{area_m2}", row[16]);
    body.replaceText("{pr_1}", row[17]);
    body.replaceText("{pr_1_gst}", row[18]);
    body.replaceText("{pr_1_suppl}", row[19]);
    body.replaceText("{pr_2}", row[20]);
    body.replaceText("{pr_2_gst}", row[21]);
    body.replaceText("{pr_2_suppl}", row[22]);
    body.replaceText("{style}", row[23]);
    body.replaceText("{style_colour}", row[24]);
    body.replaceText("{blend}", row[25]);
    body.replaceText("{colour}", row[26]);
    body.replaceText("{colour_bag}", row[27]);
    body.replaceText("{steps}", row[28]);
    body.replaceText("{steps_info}", row[29]);
    body.replaceText("{stell_reinf}", row[30]);
    body.replaceText("{concr_thickness}", row[31]);
    body.replaceText("{concr_strength_mpa}", row[32]);
    body.replaceText("{crushed_rock}", row[33]);
    body.replaceText("{sealer}", row[34]);
    body.replaceText("{drainage_info}", row[35]);
    body.replaceText("{rls_yes_no}", row[36]);
    body.replaceText("{compaction}", row[37]);
    body.replaceText("{control_joint}", row[38]);
    body.replaceText("{expansion_joint}", row[39]);
    body.replaceText("{pinning}", row[40]);
    body.replaceText("{excavation_yes_no}", row[41]);
    body.replaceText("{tip_fee_yes_no}", row[42]);
    body.replaceText("{concr}", row[43]);
    body.replaceText("{concrete_info}", row[44]);
    body.replaceText("{soil}", row[45]);
    body.replaceText("{soil_info}", row[46]);
    body.replaceText("{other}", row[47]);
    body.replaceText("{other_info}", row[48]);
    body.replaceText("{supp}", row[49]);
    body.replaceText("{other_consid}", row[50]);
    body.replaceText("{other_consid_info}", row[51]);

    doc.saveAndClose();
    let newdoc = DriveApp.createFile(doc.getAs('application/PDF'))

    tempFolder.createFile(newdoc).setName(row[52]+' QD');
    copy.setTrashed(true);
    newdoc.setTrashed(true);
    const url = newdoc.getUrl();
    sheet.getRange(index + 1, 54).setValue(url)

    
    
}) 

}

function createLocs() {

const docFile= DriveApp.getFileById("1FtOrDq6CjaaYSMSaOp69fD-7WMJp08kZEaMGtrJrzYQ");
const tempFolder = DriveApp.getFolderById("1avrVwGpPPRnBjLd2BPLkdAf5qB-hL1lk");
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LOC");
const rows = sheet.getDataRange().getValues();

rows.forEach(function(row,index){
    if (index === 0) return;
    if (row[7]=="") return;
    if(row[26]) return;
    
    const copy = docFile.makeCopy(`${row[9]} LOC` , tempFolder)
    const doc = DocumentApp.openById(copy.getId())
    const body = doc.getBody();
    const friendlyDate = Utilities.formatDate(new Date(row[3]),SpreadsheetApp.getActive().getSpreadsheetTimeZone(),'dd MMMM, yyyy');
    const friendlyDate1 = Utilities.formatDate(new Date(row[4]),SpreadsheetApp.getActive().getSpreadsheetTimeZone(),'dd MMMM, yyyy');
    const friendlyDate2 = Utilities.formatDate(new Date(row[5]),SpreadsheetApp.getActive().getSpreadsheetTimeZone(),'dd MMMM, yyyy');

    body.replaceText("{appraisal_No}", row[1]);
    body.replaceText("{SI}", row[2]);
    body.replaceText("{date}", friendlyDate);
    body.replaceText("{sched_job}", friendlyDate1);
    body.replaceText("{acce_date}", friendlyDate2);
    body.replaceText("{title}", row[6]);
    body.replaceText("{first_name}", row[7]);

    doc.saveAndClose();
    let newdoc = DriveApp.createFile(doc.getAs('application/PDF'))
    tempFolder.createFolder(row[9]);
    DriveApp.getFoldersByName(row[9]).next().createFile(newdoc).setName(row[9]+' LOC');
copy.setTrashed(true);
newdoc.setTrashed(true);
    const url = newdoc.getUrl();
    sheet.getRange(index + 1, 27).setValue(url)

var dest_folder = DriveApp.getFolderById("1avrVwGpPPRnBjLd2BPLkdAf5qB-hL1lk");
var QDfile = DriveApp.getFilesByName(row[9]+' QD')
while (QDfile.hasNext()) {

var QD = QDfile.next();
DriveApp.getFoldersByName(row[9]).next().addFile(QD);
    


} 
})
}


function createReqs() {

const docFile= DriveApp.getFileById("1T9FcJaDYcrddoWnNN8pMXUq1QyiPWxpGfdvg1Rj9RQY");
const tempFolder = DriveApp.getFolderById("1Zyu6-rXLFOqguVTfExYSZuL3fRLDid6y");
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("REQ");
const rows = sheet.getDataRange().getValues();

rows.forEach(function(row,index){
    if (index === 0) return;
    if (row[6]=="") return;
    if(row[51]) return;
    
    const copy = docFile.makeCopy(`${row[8]} REQ` , tempFolder)
    const doc = DocumentApp.openById(copy.getId())
    const body = doc.getBody();
    const friendlyDate = Utilities.formatDate(new Date(row[2]),Session.getScriptTimeZone(),'dd MMMM, yyyy');

    body.replaceText("{date}", friendlyDate);
    body.replaceText("{job_for}", row[3]);
    body.replaceText("{spl_nb}", row[4]);
    body.replaceText("{title}", row[5]);
    body.replaceText("{first_name}", row[6]);
     body.replaceText("{last_name}", row[7]);
    body.replaceText("{customer}", row[8]);
    body.replaceText("{addr}", row[9]);
    body.replaceText("{sb}", row[10]);
    body.replaceText("{email}", row[11]);
    body.replaceText("{ph_mob}", row[12]);
    body.replaceText("{st}", row[13]);
    body.replaceText("{area_m2}", row[14]);
    body.replaceText("{steel_is}", row[15]);
    body.replaceText("{mpa_is}", row[16]);
    body.replaceText("{conc_suppl}", row[17]);
    body.replaceText("{exp_agg_b}", row[18]);
    body.replaceText("{job_p}", row[19]);
    body.replaceText("{exc}", row[20]);
    body.replaceText("{exc_info}", row[21]);
    body.replaceText("{exc_h}", row[22]);
    body.replaceText("{req_h}", row[23]);
    body.replaceText("{prep_time}", row[24]);
    body.replaceText("{prep_men}", row[25]);
    body.replaceText("{pour_time}", row[26]);
    body.replaceText("{pour_men}", row[27]);
    body.replaceText("{tip_fee}", row[28]);
    body.replaceText("{removing}", row[29]);
    body.replaceText("{removing_info}", row[30]);
    body.replaceText("{tip_fee_w}", row[31]);
    body.replaceText("{no_bins}", row[32]);
    body.replaceText("{bins_info}", row[33]);
    body.replaceText("{no_loads}", row[34]);
    body.replaceText("{loads_info}", row[35]);
    body.replaceText("{job_pump}", row[36]);
    body.replaceText("{pump_info}", row[37]);
    body.replaceText("{saw_cut}", row[38]);
    body.replaceText("{saw_info}", row[39]);
    body.replaceText("{drains}", row[40]);
    body.replaceText("{q_drains}", row[41]);
    body.replaceText("{type_drains}", row[42]);
    body.replaceText("{where_drains}", row[43]);
    body.replaceText("{supp_piers}", row[44]);
    body.replaceText("{where_supp_piers}", row[45]);
    body.replaceText("{lab_job}", row[46]);
    body.replaceText("{mtl_job}", row[47]);
    body.replaceText("{ttl_job}", row[48]);
    body.replaceText("{all_lab}", row[49]);
    body.replaceText("{all_JH}", row[50]);

    doc.saveAndClose();
    let newdoc = DriveApp.createFile(doc.getAs('application/PDF'))

    tempFolder.createFile(newdoc).setName(row[8]+' REQ');
    copy.setTrashed(true);
    newdoc.setTrashed(true);
    
   const url = newdoc.getUrl();
    sheet.getRange(index + 1, 52).setValue(url);
    
  

var REQfile = DriveApp.getFilesByName(row[8]+' REQ')
while (REQfile.hasNext()) {

var REQ = REQfile.next();
DriveApp.getFoldersByName(row[8]).next().addFile(REQ);
tempFolder.createFile(REQ);


    
    

}
}) 

}

