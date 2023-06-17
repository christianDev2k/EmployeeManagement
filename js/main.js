// ======================== CONSTANT ==============================

const EMPLOYEE_STORAGE_KEY = 'employee_list';

const _$ = document.querySelector.bind(document);
const _$$ = document.querySelectorAll.bind(document);

const tkInput = _$('#tknv');
const nameInput = _$('#name');
const emailInput = _$('#email');
const passwordInput = _$('#password');
const dateInput = _$('#datepicker');
const salaryInput = _$('#luongCB');
const positionInput = _$('#chucvu');
const timeInput = _$('#gioLam');
const filterInput = _$('#searchName');
const modalForm = _$('#modal-form');
const openModalAddButton = _$('#btnThem');
const updateButton = _$('#btnCapNhat');
const addButton = _$('#btnThemNV');

const employeeList = new EmployeesList();
const regex = {
    id: /^[a-zA-Z\d]{4,6}$/,
    name: /^[a-zA-Z\sÀ-ỹ]+$/,
    email: /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/,
    pw: /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{6,10}$/,
    date: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[0-1])\/\d{4}$/,
    salary: /^[0-9]+$/,
    time: /^[0-9]+$/,
};

let editIndex = -1;

// =============== LOCAL STORAGE ================

function setStorage(arr) {
    localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(arr));
}

function getStorage() {
    if (localStorage.getItem(EMPLOYEE_STORAGE_KEY)) {
        const backupEmployee = JSON.parse(localStorage.getItem(EMPLOYEE_STORAGE_KEY));
        const arrEmployee = backupEmployee.map(
            (employeeObj) =>
                (newEmployee = new employee(
                    employeeObj.id,
                    employeeObj.name,
                    employeeObj.email,
                    employeeObj.pw,
                    employeeObj.date,
                    employeeObj.salary,
                    employeeObj.position,
                    employeeObj.time
                ))
        );

        employeeList.list = arrEmployee;
        app.renderEmployee();
    } else employeeList.list = [];
}

// ======================= MAIN SECTION ===========================

const app = {
    // Handle Events
    handleEvent() {
        const _this = this;

        // Ẩn nút cập nhật
        openModalAddButton.onclick = () => {
            editIndex = -1;
            // _this.resetForm(); ========================

            updateButton.style.display = 'none';
            addButton.style.display = 'block';
        };

        // Validator ==> Add / Edit
        Validators({
            form: '#modal-form',
            rules: [
                Validators.isAccount('#tknv', employeeList),
                Validators.isName('#name'),
                Validators.isEmail('#email'),
                Validators.isPassword('#password'),
                Validators.isDay('#datepicker'),
                Validators.isSalary('#luongCB'),
                Validators.isPosition('#chucvu'),
                Validators.isTime('#gioLam'),
            ],
            onSubmit(data) {
                _this.handleEmployee(data);
            },
        });

        // Sự kiện xóa và hiện bảng chỉnh sửa nhân viên
        _$('#tableDanhSach').onclick = (e) => {
            if (e.target.dataset.id) {
                e.target.innerText === 'Xóa' ? _this.handleDeleteEmployee(e) : _this.getEmployee(e);
            }
        };

        // Sự kiện lọc nhân viên
        _$('#btnTimNV').onclick = () => {
            _this.handleFilterEmployee();
        };

        filterInput.oninput = function () {
            this.classList.remove('invalid');
        };

        _$('#btnClearFilter').onclick = () => {
            _this.renderEmployee();
        };
    },

    // Handle process data
    handleEmployee(data) {
        let newEmployee = new employee(
            data.account,
            data.name,
            data.email,
            data.password,
            data.date,
            data.salary,
            data.position,
            data.time
        );
        editIndex === -1 ? this.addEmployee(newEmployee) : this.handleEditEmployee(newEmployee);
    },

    // Add a new employee
    addEmployee(newEmployee) {
        employeeList.addEmployeeMethod(newEmployee);
        setStorage(employeeList.list);
        this.renderEmployee();
    },

    // Delete a employee
    handleDeleteEmployee(e) {
        const employeeItemID = e.target.dataset.id;
        const employeeItem = _$('#' + employeeItemID);
        const id = employeeItem.querySelector('td:nth-child(1)').innerText;

        // Remove the employee in HTML
        employeeItem.remove();

        // Delete the employee list
        employeeList.deleteEmployee(id);

        // Update local
        setStorage(employeeList.list);
    },

    // Get imformation to input element
    getEmployee(e) {
        const employeeItemID = e.target.dataset.id;
        const employeeItem = _$('#' + employeeItemID);
        const id = employeeItem.querySelector('td:nth-child(1)').innerText;

        updateButton.style.display = 'block';
        addButton.style.display = 'none';
        this.resetForm();

        editIndex =
            employeeList.findIndexMethod(id) !== -1
                ? employeeList.findIndexMethod(id)
                : alert('Không tìm thấy edit index');

        tkInput.value = employeeList.list[editIndex].id;
        nameInput.value = employeeList.list[editIndex].name;
        emailInput.value = employeeList.list[editIndex].email;
        passwordInput.value = employeeList.list[editIndex].pw;
        dateInput.value = employeeList.list[editIndex].date;
        salaryInput.value = employeeList.list[editIndex].salary;
        positionInput.value = employeeList.list[editIndex].position;
        timeInput.value = employeeList.list[editIndex].time;
    },

    // Edit the employee
    handleEditEmployee(updatedEmployee) {
        employeeList.editEmployee(updatedEmployee, editIndex);
        setStorage(employeeList.list);
        this.renderEmployee();
    },

    // Filter employee
    handleFilterEmployee() {
        const filtered = employeeList.searchEmployee(filterInput.value);

        if (filtered.length) {
            _$('#searchName').classList.remove('invalid');
            this.renderEmployee(filtered);
        } else {
            _$('#searchName').classList.add('invalid');
        }
    },

    // Render HTML
    renderEmployee(arr = employeeList.list) {
        let html = arr.map((employee) => {
            return `
                <tr id="employee-item-${employee.id}">
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.date}</td>
                    <td>${employee.position}</td>
                    <td>${employee.sumSalary() ? Number(employee.sumSalary()).toLocaleString('vi-VN') : 'No value'}</td>
                    <td>${employee.ratingEmployee() ? employee.ratingEmployee() : 'No value'}</td>
                    <td>
                        <button data-id="employee-item-${employee.id}" class="btn btn-info mb-1" data-toggle="modal"
                            data-target="#myModal">Chỉnh sửa</button>
                        <button data-id="employee-item-${employee.id}" class="btn btn-danger mt-1">Xóa</button>
                    </td>
                </tr>
            `;
        });
        _$('#tableDanhSach').innerHTML = html.join('');
    },

    // Reset form
    resetForm() {
        const inputNodeList = _$$('#modal-form .form-control');

        inputNodeList.forEach((inputNode) => {
            inputNode.classList.remove('invalid');
            inputNode.parentElement.nextElementSibling.innerText = '';

            modalForm.reset();
        });
    },

    // ========================== START =================================
    start() {
        getStorage();
        this.handleEvent();
    },
};

app.start();
