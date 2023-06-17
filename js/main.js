// CONSTANT
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
const filterValue = _$('#searchValue');
const modalForm = _$('#modal-form');
const openModalAddButton = _$('#btnThem');
const updateButton = _$('#btnCapNhat');
const addButton = _$('#btnThemNV');

const employeeList = new EmployeesList();

let editIndex = -1;
let newEmployee;

// =============== LOCAL STORAGE ================

function setStorage(arr) {
    localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(arr));
}

function getStorage() {
    const backupEmployee = localStorage.getItem(EMPLOYEE_STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(EMPLOYEE_STORAGE_KEY))
        : [];

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
}

// =================================================================

const app = {
    // Handle Events
    handleEvent() {
        // Ẩn nút cập nhật
        openModalAddButton.onclick = () => {
            updateButton.style.display = 'none';
            addButton.style.display = 'block';
        }

        // Validator ==> Add / Edit
        Validator({
            form: '#modal-form',
            rules: [
                Validator.isAccount('#tknv'),
            ]
        })
    },

    // Xóa nhân viên
    handleDeleteEmployee(e) {
        const employeeItemID = e.target.dataset.id;
        const employeeItem = _$('#' + employeeItemID);
        const id = employeeItem.querySelector('td:nth-child(1)').innerText;

        // Xóa giao diện
        employeeItem.remove();

        // Xóa mảng
        employeeList.deleteEmployee(id);

        // Update local
        setStorage(employeeList.list);
    },

    // Put thông tin nhân viên lên ô value
    getEmployee(e) {
        const employeeItemID = e.target.dataset.id;
        const employeeItem = _$('#' + employeeItemID);
        const id = employeeItem.querySelector('td:nth-child(1)').innerText;

        updateButton.style.display = 'block';
        addButton.style.display = 'none';

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

    // Chỉnh sửa thông tin nhân viên
    handleEditEmployee(updatedEmployee) {
        employeeList.editEmployee(updatedEmployee, editIndex);
        setStorage(employeeList.list);
        this.renderEmployee();
    },

    // Tìm nhân viên
    handleFilterEmployee() {
        const filteredEmployee = employeeList.searchEmployee(filterValue.value);

        if (filteredEmployee.length) {
            _$('#searchValue').classList.remove('invalid');
            this.renderEmployee(filteredEmployee);
        } else {
            _$('#searchValue').classList.add('invalid');
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

    // ========================== START =================================
    start() {
        getStorage();
        this.handleEvent();
    },
};

app.start();
