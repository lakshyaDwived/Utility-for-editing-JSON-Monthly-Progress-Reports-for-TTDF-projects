document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function() {
        console.log("File selected:", fileInput.files[0]);
    });
});

function loadFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please select a file before clicking 'Load File'");
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            populateForm(data);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Failed to parse JSON file. Please check the file format.");
        }
    };
    reader.onerror = function(e) {
        console.error("File could not be read:", e);
        alert("Failed to read file. Please try again.");
    };
    reader.readAsText(file);
}

function populateForm(data) {
    const form = document.getElementById('mprForm');
    form.innerHTML = '';
    addInput(form, 'Identifier', 'identifier', data.identifier);

    if (data.mprs) {
        for (const mpr of data.mprs) {
            addMprSection(form, mpr);
        }
    }
}

function addMprSection(container, mpr = {}) {
    const section = document.createElement('div');
    section.className = 'mpr-section';
    section.innerHTML = `
        <label>MPR Date: <input type="text" name="mpr_date" value="${mpr.mpr_date || ''}"></label><br>
        <label>MPR Month: <input type="number" name="mpr_month" value="${mpr.mpr_month || ''}"></label><br>
        <label>MPR Year: <input type="number" name="mpr_year" value="${mpr.mpr_year || ''}"></label><br>
        <label>File Path: <input type="text" name="file_path" value="${mpr.file_path || ''}"></label><br>
        <button type="button" onclick="addItemwiseFundsUtilizedSection(this)">Add Itemwise Funds Utilized</button>
        <div class="itemwise-funds-utilized"></div>
        <button type="button" onclick="addMilestoneSection(this)">Add Milestone</button>
        <div class="milestones"></div>
        <button type="button" onclick="removeSection(this)">Remove MPR</button>
    `;
    container.appendChild(section);

    if (mpr.itemwise_funds_utilized) {
        for (const fund of mpr.itemwise_funds_utilized) {
            addItemwiseFundsUtilizedSection(section.querySelector('.itemwise-funds-utilized'), fund);
        }
    }

    if (mpr.milestones) {
        for (const milestone of mpr.milestones) {
            addMilestoneSection(section.querySelector('.milestones'), milestone);
        }
    }
}

function addItemwiseFundsUtilizedSection(container, fund = {}) {
    const section = document.createElement('div');
    section.className = 'fund-section';
    section.innerHTML = `
        <label>Expense Head: <input type="text" name="expense_head" value="${fund.expense_head || ''}"></label><br>
        <label>Approved Quantity: <input type="number" name="appoved_qty" value="${fund.appoved_qty || ''}"></label><br>
        <label>Procurement Stage: <input type="text" name="procurement_stage" value="${fund.procurement_stage || ''}"></label><br>
        <label>Amount Approved: <input type="number" step="0.01" name="amnt_approved" value="${fund.amnt_approved || ''}"></label><br>
        <label>Amount Utilized: <input type="number" step="0.01" name="amnt_utilized" value="${fund.amnt_utilized || ''}"></label><br>
        <label>Remarks: <input type="text" name="remarks" value="${fund.remarks || ''}"></label><br>
        <button type="button" onclick="removeSection(this)">Remove</button>
    `;
    container.appendChild(section);
}

function addMilestoneSection(container, milestone = {}) {
    const section = document.createElement('div');
    section.className = 'milestone-section';
    section.innerHTML = `
        <label>Description: <input type="text" name="description" value="${milestone.description || ''}"></label><br>
        <button type="button" onclick="addWorkPackageSection(this)">Add Work Package</button>
        <div class="work-packages"></div>
        <button type="button" onclick="addInstalmentExpenditureSection(this)">Add Instalment Expenditure</button>
        <div class="instalment-expenditures"></div>
        <button type="button" onclick="removeSection(this)">Remove Milestone</button>
    `;
    container.appendChild(section);

    if (milestone.work_packages) {
        for (const wp of milestone.work_packages) {
            addWorkPackageSection(section.querySelector('.work-packages'), wp);
        }
    }

    if (milestone.instalment_expenditures) {
        for (const expenditure of milestone.instalment_expenditures) {
            addInstalmentExpenditureSection(section.querySelector('.instalment-expenditures'), expenditure);
        }
    }

    addFundUtilisationSection(section, milestone.fund_utilisation);
}

function addWorkPackageSection(container, wp = {}) {
    const section = document.createElement('div');
    section.className = 'work-package-section';
    section.innerHTML = `
        <label>Description: <input type="text" name="description" value="${wp.description || ''}"></label><br>
        <label>Average Percentage Complete: <input type="number" step="0.01" name="avg_pct_complete" value="${wp.avg_pct_complete || ''}"></label><br>
        <button type="button" onclick="addDeliverableSection(this)">Add Deliverable</button>
        <div class="deliverables"></div>
        <button type="button" onclick="removeSection(this)">Remove Work Package</button>
    `;
    container.appendChild(section);

    if (wp.deliverables) {
        for (const deliverable of wp.deliverables) {
            addDeliverableSection(section.querySelector('.deliverables'), deliverable);
        }
    }
}

function addDeliverableSection(container, deliverable = {}) {
    const section = document.createElement('div');
    section.className = 'deliverable-section';
    section.innerHTML = `
        <label>Description: <input type="text" name="description" value="${deliverable.description || ''}"></label><br>
        <label>Planned Start: <input type="text" name="planned_start" value="${deliverable.planned_start || ''}"></label><br>
        <label>Planned Finish: <input type="text" name="planned_finish" value="${deliverable.planned_finish || ''}"></label><br>
        <label>Actual Start: <input type="text" name="actual_start" value="${deliverable.actual_start || ''}"></label><br>
        <label>Actual Finish: <input type="text" name="actual_finish" value="${deliverable.actual_finish || ''}"></label><br>
        <label>Percentage Complete: <input type="number" step="0.01" name="pct_complete" value="${deliverable.pct_complete || ''}"></label><br>
        <label>Remarks: <input type="text" name="remarks" value="${deliverable.remarks || ''}"></label><br>
        <button type="button" onclick="removeSection(this)">Remove Deliverable</button>
    `;
    container.appendChild(section);
}

function addInstalmentExpenditureSection(container, expenditure = {}) {
    const section = document.createElement('div');
    section.className = 'instalment-expenditure-section';
    section.innerHTML = `
        <label>Instalment Number: <input type="number" name="instalment_number" value="${expenditure.instalment_number || ''}"></label><br>
        <label>Percentage TTDF Grant: <input type="number" step="0.01" name="pct_ttdf_grant" value="${expenditure.pct_ttdf_grant || ''}"></label><br>
        <label>Approved Amount: <input type="number" step="0.01" name="approved_amt" value="${expenditure.approved_amt || ''}"></label><br>
        <label>USOF Sanctioned Amount: <input type="number" step="0.01" name="usof_snct_amt" value="${expenditure.usof_snct_amt || ''}"></label><br>
        <label>USOF Sanctioned Date: <input type="text" name="usof_snct_date" value="${expenditure.usof_snct_date || ''}"></label><br>
        <label>Amount Disbursed: <input type="number" step="0.01" name="amt_disbursed" value="${expenditure.amt_disbursed || ''}"></label><br>
        <label>Disbursed Date: <input type="text" name="amt_disbursed_date" value="${expenditure.amt_disbursed_date || ''}"></label><br>
        <label>Amount Utilized: <input type="number" step="0.01" name="amt_utilized" value="${expenditure.amt_utilized || ''}"></label><br>
        <button type="button" onclick="removeSection(this)">Remove Instalment Expenditure</button>
    `;
    container.appendChild(section);
}

function addFundUtilisationSection(container, fund = {}) {
    const section = document.createElement('div');
    section.className = 'fund-utilisation';
    section.innerHTML = `
        <label>Manpower Approved: <input type="number" name="manpower_approved" value="${fund.manpower_approved || ''}"></label><br>
        <label>Manpower Utilized: <input type="number" name="manpower_utilized" value="${fund.manpower_utilized || ''}"></label><br>
        <label>Capital Approved: <input type="number" name="capital_approved" value="${fund.capital_approved || ''}"></label><br>
        <label>Capital Utilized: <input type="number" name="capital_utilized" value="${fund.capital_utilized || ''}"></label><br>
        <label>Consumables Approved: <input type="number" name="consumables_approved" value="${fund.consumables_approved || ''}"></label><br>
        <label>Consumables Utilized: <input type="number" name="consumables_utilized" value="${fund.consumables_utilized || ''}"></label><br>
        <label>Other Approved: <input type="number" name="other_approved" value="${fund.other_approved || ''}"></label><br>
        <label>Other Utilized: <input type="number" name="other_utilized" value="${fund.other_utilized || ''}"></label><br>
        <label>Total Approved: <input type="number" name="total_approved" value="${fund.total_approved || ''}"></label><br>
        <label>Total Utilized: <input type="number" name="total_utilized" value="${fund.total_utilized || ''}"></label><br>
        <label>Remarks: <input type="text" name="remarks" value="${fund.remarks || ''}"></label><br>
    `;
    container.appendChild(section);
}

function removeSection(button) {
    button.parentElement.remove();
}

function addInput(container, label, name, value = '') {
    const div = document.createElement('div');
    div.innerHTML = `<label>${label}: <input type="text" name="${name}" value="${value}"></label><br>`;
    container.appendChild(div);
}

function saveFile() {
    const form = document.getElementById('mprForm');
    const data = {};

    const identifier = form.querySelector('input[name="identifier"]').value;
    if (identifier) data.identifier = identifier;

    const mprs = [];
    form.querySelectorAll('.mpr-section').forEach(mprSection => {
        const mpr = {
            mpr_date: mprSection.querySelector('input[name="mpr_date"]').value,
            mpr_month: mprSection.querySelector('input[name="mpr_month"]').value,
            mpr_year: mprSection.querySelector('input[name="mpr_year"]').value,
            file_path: mprSection.querySelector('input[name="file_path"]').value,
            itemwise_funds_utilized: [],
            milestones: []
        };
        mprSection.querySelectorAll('.fund-section').forEach(fundSection => {
            mpr.itemwise_funds_utilized.push({
                expense_head: fundSection.querySelector('input[name="expense_head"]').value,
                appoved_qty: fundSection.querySelector('input[name="appoved_qty"]').value,
                procurement_stage: fundSection.querySelector('input[name="procurement_stage"]').value,
                amnt_approved: fundSection.querySelector('input[name="amnt_approved"]').value,
                amnt_utilized: fundSection.querySelector('input[name="amnt_utilized"]').value,
                remarks: fundSection.querySelector('input[name="remarks"]').value
            });
        });
        mprSection.querySelectorAll('.milestone-section').forEach(milestoneSection => {
            const milestone = {
                description: milestoneSection.querySelector('input[name="description"]').value,
                work_packages: [],
                instalment_expenditures: [],
                fund_utilisation: {
                    manpower_approved: milestoneSection.querySelector('input[name="manpower_approved"]').value,
                    manpower_utilized: milestoneSection.querySelector('input[name="manpower_utilized"]').value,
                    capital_approved: milestoneSection.querySelector('input[name="capital_approved"]').value,
                    capital_utilized: milestoneSection.querySelector('input[name="capital_utilized"]').value,
                    consumables_approved: milestoneSection.querySelector('input[name="consumables_approved"]').value,
                    consumables_utilized: milestoneSection.querySelector('input[name="consumables_utilized"]').value,
                    other_approved: milestoneSection.querySelector('input[name="other_approved"]').value,
                    other_utilized: milestoneSection.querySelector('input[name="other_utilized"]').value,
                    total_approved: milestoneSection.querySelector('input[name="total_approved"]').value,
                    total_utilized: milestoneSection.querySelector('input[name="total_utilized"]').value,
                    remarks: milestoneSection.querySelector('input[name="remarks"]').value
                }
            };
            milestoneSection.querySelectorAll('.work-package-section').forEach(wpSection => {
                const workPackage = {
                    description: wpSection.querySelector('input[name="description"]').value,
                    avg_pct_complete: wpSection.querySelector('input[name="avg_pct_complete"]').value,
                    deliverables: []
                };
                wpSection.querySelectorAll('.deliverable-section').forEach(deliverableSection => {
                    workPackage.deliverables.push({
                        description: deliverableSection.querySelector('input[name="description"]').value,
                        planned_start: deliverableSection.querySelector('input[name="planned_start"]').value,
                        planned_finish: deliverableSection.querySelector('input[name="planned_finish"]').value,
                        actual_start: deliverableSection.querySelector('input[name="actual_start"]').value,
                        actual_finish: deliverableSection.querySelector('input[name="actual_finish"]').value,
                        pct_complete: deliverableSection.querySelector('input[name="pct_complete"]').value,
                        remarks: deliverableSection.querySelector('input[name="remarks"]').value
                    });
                });
                milestone.work_packages.push(workPackage);
            });
            milestoneSection.querySelectorAll('.instalment-expenditure-section').forEach(expenditureSection => {
                milestone.instalment_expenditures.push({
                    instalment_number: expenditureSection.querySelector('input[name="instalment_number"]').value,
                    pct_ttdf_grant: expenditureSection.querySelector('input[name="pct_ttdf_grant"]').value,
                    approved_amt: expenditureSection.querySelector('input[name="approved_amt"]').value,
                    usof_snct_amt: expenditureSection.querySelector('input[name="usof_snct_amt"]').value,
                    usof_snct_date: expenditureSection.querySelector('input[name="usof_snct_date"]').value,
                    amt_disbursed: expenditureSection.querySelector('input[name="amt_disbursed"]').value,
                    amt_disbursed_date: expenditureSection.querySelector('input[name="amt_disbursed_date"]').value,
                    amt_utilized: expenditureSection.querySelector('input[name="amt_utilized"]').value
                });
            });
            mpr.milestones.push(milestone);
        });
        mprs.push(mpr);
    });

    data.mprs = mprs;
    downloadJson(data);
}

function downloadJson(data) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
