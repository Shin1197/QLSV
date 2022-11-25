/**
 * QUẢN LÝ SINH VIÊN (CRUD)
 * 1. Create Sinh Viên
 * 2. Read Sinh Viên
 * 3. Update Sinh Viên
 * 4. Delete Sinh Viên
 * 5. Search Sinh Viên (Mã sinh viên || Tên)
 * 6. Validate form (XSS attack || fishing || CSRF)
 *
 * PO, PM, BA ===> PRD (Product requirements document)
 * Devops, Operator => setup hệ thống
 * Designer => giao diện
 * Backend => phân tích xây dựng DB
 * Frontend => HTML + CSS
 * Integration FE + BE
 * QA/QC => Manual tester || Automation
 *
 */

// Phân rã lớp đối tượng: Student
// + studentId
// + fullName
// + email
// + dob
// + course
// + math
// + physic
// + chemistry
// + calcGPA()

var studentList = [];
// "create" || "update"
var mode = "create";

function submitForm() {
  if (mode === "create") createStudent();
  else if (mode === "update") updateStudent();
}

function createStudent() {
  // validate form before creating new student
  if (!validateForm()) return;

  // 1. DOM lấy input
  var id = document.getElementById("txtMaSV").value;
  var fullName = document.getElementById("txtTenSV").value;
  var email = document.getElementById("txtEmail").value;
  var dob = document.getElementById("txtNgaySinh").value;
  var course = document.getElementById("khSV").value;
  var math = +document.getElementById("txtDiemToan").value;
  var physic = +document.getElementById("txtDiemLy").value;
  var chemistry = +document.getElementById("txtDiemHoa").value;

  // 2. Check trùng id
  for (var i = 0; i < studentList.length; i++) {
    if (studentList[i].studentId === id) {
      alert("ID đã tồn tại vui lòng nhập lại");
      return;
    }
  }
  // 3. Tạo đối tượng sinh viên
  var student = new Student(
    id,
    fullName,
    email,
    dob,
    course,
    math,
    physic,
    chemistry
  );
  // 4. Thêm đối tượng sinh viên vào danh sách
  studentList.push(student);

  // Hiện danh sách sinh viên ra màng hình
  renderStudent();

  // Lưu danh sách sinh viên hiện tại xuống local
  saveStudentList();
}

// Cách lập động html ra màng hình
function renderStudent(data) {
  if (!data) data = studentList;
  //cách viết #: data = data || studentList;
  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `
                        <tr>
                            <td>${data[i].studentId}</td>
                            <td>${data[i].fullName}</td>
                            <td>${data[i].email}</td>
                            <td>${data[i].dob}</td>
                            <td>${data[i].course}</td>
                            <td>${data[i].calcGPA()}</td>
                            <td>
                            <button onclick="deleteStudent('${
                              data[i].studentId
                            }')" class="btn btn-danger">Del</button>
                            <button onclick="getUpdateStudent('${
                              data[i].studentId
                            }')" class="btn btn-info">Update</button>
                            </td>

                        </tr>`;
  }
  document.getElementById("tbodySinhVien").innerHTML = html;
}

function saveStudentList() {
  // Chuyển studenList thành chuỗi JSON
  var studentListJson = JSON.stringify(studentList);
  console.log(studentListJson);
  localStorage.setItem("SL", studentListJson);
}

function getStudentList() {
  var studentListJson = localStorage.getItem("SL");
  // Kiểm tra nếu dưới local không có dữ liệu studentListJson = null => return
  if (!studentListJson) return [];
  // Chuyển lại từ JSON về object
  return JSON.parse(studentListJson);
}

// input: datalocal => output data mới
function mapStudentList(local) {
  var result = [];
  for (var i = 0; i < local.length; i++) {
    var oldStudent = local[i];
    var newStudent = new Student(
      oldStudent.studentId,
      oldStudent.fullName,
      oldStudent.email,
      oldStudent.dob,
      oldStudent.course,
      oldStudent.math,
      oldStudent.physic,
      oldStudent.chemistry
    );
    result.push(newStudent);
  }
  return result;
}

// Xóa sinh viên
function deleteStudent(id) {
  var index = findById(id);
  if (index === -1) return alert("ID không tồn tại!"); // return undefined

  studentList.splice(index, 1);

  renderStudent();

  saveStudentList();
}

// Part 1: Chọn sinh viên muốn cập nhật và hiện thông tin lên form
function getUpdateStudent(id) {
  var index = findById(id);
  if (index === -1) return alert("ID không tồn tại nhé !");

  var student = studentList[index];

  document.getElementById("txtMaSV").value = student.studentId;
  document.getElementById("txtTenSV").value = student.fullName;
  document.getElementById("txtEmail").value = student.email;
  document.getElementById("txtNgaySinh").value = student.dob;
  document.getElementById("khSV").value = student.course;
  document.getElementById("txtDiemToan").value = student.math;
  document.getElementById("txtDiemLy").value = student.physic;
  document.getElementById("txtDiemHoa").value = student.chemistry;

  // Disable input mã sinh viên
  document.getElementById("txtMaSV").disabled = true;
  // Đổi mode sang update
  mode = "update";
  document.getElementById("btnCreate").innerHTML = "Lưu Thay Đổi";
  document.getElementById("btnCreate").classList.add("btn-info");

  // Add button cancel để cancel update
  var btnCancel = document.createElement("button");
  btnCancel.id = "btnCancel";
  btnCancel.innerHTML = "Hủy";
  btnCancel.type = "button";
  btnCancel.classList.add("btn", "btn-secondary");
  btnCancel.onclick = cancelUpdate;
  document.getElementById("btnGroup").appendChild(btnCancel);
}

function cancelUpdate() {
  mode = "create";
  document.getElementById("btnCreate").innerHTML = "Thêm Sinh Viên";
  document.getElementById("btnCreate").classList.remove("btn-info");
  // Cách 1:
  // var btnGroupDiv = document.getElementById("btnGroup");
  // btnGroupDiv.removeChild(btnGroupDiv.lastElementChild);

  // Cách 2:
  var btnCancel = document.getElementById("btnCancel");
  btnCancel.remove();

  // Reset form
  document.getElementById("form").reset();
  // Gỡ disable ra khỏi input
  document.getElementById("txtMaSV").disabled = false;
}

// Part 2: Cho người dùng sửa trên form, nhấn nút lưu để cập nhật
function updateStudent() {
  // 1. DOM lấy input
  var id = document.getElementById("txtMaSV").value;
  var fullName = document.getElementById("txtTenSV").value;
  var email = document.getElementById("txtEmail").value;
  var dob = document.getElementById("txtNgaySinh").value;
  var course = document.getElementById("khSV").value;
  var math = +document.getElementById("txtDiemToan").value;
  var physic = +document.getElementById("txtDiemLy").value;
  var chemistry = +document.getElementById("txtDiemHoa").value;

  var index = findById(id);
  var student = studentList[index];
  student.fullName = fullName;
  student.email = email;
  student.dob = dob;
  student.course = course;
  student.math = math;
  student.physic = physic;
  student.chemistry = chemistry;

  renderStudent();
  saveStudentList();

  cancelUpdate();
}

// input: id => output: index
function findById(id) {
  for (var i = 0; i < studentList.length; i++) {
    if (studentList[i].studentId === id) {
      return i;
    }
  }
  return -1;
}

window.onload = function () {
  // Code muốn chạy ngay lập tức khi load trang
  var studentListFromLocal = getStudentList(); // => [{}, {}, {}]
  studentList = mapStudentList(studentListFromLocal);
  console.log(studentList);
  renderStudent();
};

// Search sinh viên
function searchStudent(e) {
  var keyword = e.target.value.toLowerCase().trim(); // toLowerCase() chuyển vể chữ thường hết để tìm kiếm, trim() cắt khoảng trắng hai đầu chữ
  var result = [];

  for (var i = 0; i < studentList.length; i++) {
    var studentId = studentList[i].studentId;
    var studentName = studentList[i].fullName.toLowerCase();

    if (studentId === keyword || studentName.includes(keyword)) {
      result.push(studentList[i]);
    }
  }
  renderStudent(result);
}

// --------------VALIDATION----------------------

// required
/**
 * val: string
 * config: {
 *    errorId: string
 * }
 *
 *
 */

function required(val, config) {
  if (val.length > 0) {
    document.getElementById(config.errorId).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorId).innerHTML =
    "*Vui lòng nhập giá trị vào";
  return false;
}

// min-length vs max-length
/**
 * val: string
 * config: {
 *    errorId: string,
 *    min: number,
 *    max: number
 * }
 *
 *
 */
function length(val, config) {
  if (val.length < config.min || val.length > config.max) {
    document.getElementById(
      config.errorId
    ).innerHTML = `*Độ dài phải từ ${config.min} đến ${config.max} kí tự`;
    return false;
  }
  document.getElementById(config.errorId).innerHTML = "";
  return true;
}

// pattern - regular expression (biểu thức chính quy)
/**
 * val: string
 * config: {
 *    errorId: string,
 *    regexp: object
 * }
 *
 *
 */
function pattern(val, config) {

  var result = config.regexp.test(val)
  if (result) {
    document.getElementById(config.errorId).innerHTML = "";
    return true;
  }

  document.getElementById(config.errorId).innerHTML =
    "*Không đúng định dạng vui lòng nhập lại";
  return false;
}

function validateForm() {
  var studentId = document.getElementById("txtMaSV").value;
  var fullName = document.getElementById("txtTenSV").value;

  var textRegexp =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\$s\W|_]+/g;

  // nối các hàm kiểm tra của ô studentId

  var studentIdValid =
    required(studentId, { errorId: "studentIdError" }) &&
    length(studentId, { errorId: "studentIdError", min: 3, max: 8 });

  var nameValid =
    required(fullName, { errorId: "nameError" }) &&
    pattern(fullName, { errorId: "nameError", regexp: textRegexp });

  // var emailValid = required(email, {errorId: "emailError"});
  var isFormValid = studentIdValid && nameValid;

  return isFormValid;
}
