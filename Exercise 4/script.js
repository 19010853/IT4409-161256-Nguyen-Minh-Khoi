// Chờ cho toàn bộ nội dung HTML được tải xong trước khi chạy script
document.addEventListener('DOMContentLoaded', () => {

    // --- (Không thay đổi) Hàm định dạng giá tiền ---
    /**
     * Định dạng một số thành chuỗi có dấu phẩy ngăn cách hàng nghìn.
     * @param {number | string} number - Số cần định dạng.
     * @returns {string} - Chuỗi đã định dạng.
     */
    function formatPrice(number) {
        const numericValue = parseFloat(number);
        if (isNaN(numericValue)) {
            return String(number); 
        }
        return new Intl.NumberFormat('en-US').format(numericValue);
    }


    // --- Lấy các phần tử DOM chính ---
    const toggleBtn = document.getElementById('toggleFormBtn');
    const addForm = document.getElementById('addProductForm');
    const searchInput = document.getElementById('searchInput');
    const productList = document.querySelector('.product-list');

    // --- (BỔ SUNG BÀI 4) Lấy các phần tử của Form ---
    const cancelBtn = document.getElementById('cancelBtn');
    const errorMsg = document.getElementById('formError');


    // --- Chức năng 1: Ẩn/hiện Form Thêm Sản Phẩm ---
    
    // (Không thay đổi)
    if (toggleBtn && addForm) {
        toggleBtn.addEventListener('click', () => {
            addForm.classList.toggle('hidden');
            if (addForm.classList.contains('hidden')) {
                toggleBtn.textContent = 'Thêm sản phẩm';
                // (BỔ SUNG) Ẩn lỗi khi đóng form
                if(errorMsg) errorMsg.classList.add('hidden');
            } else {
                toggleBtn.textContent = 'Đóng Form';
            }
        });
    }

    // --- (BỔ SUNG BÀI 4) Chức năng Hủy (Nút Cancel) ---
    if (cancelBtn && addForm && toggleBtn && errorMsg) {
        cancelBtn.addEventListener('click', () => {
            addForm.reset(); // Xóa nội dung form
            addForm.classList.add('hidden'); // Ẩn form
            errorMsg.classList.add('hidden'); // Ẩn thông báo lỗi
            toggleBtn.textContent = 'Thêm sản phẩm'; // Đặt lại tên nút
        });
    }


    // --- Chức năng 2: Lọc/Tìm Kiếm Sản Phẩm ---
    
    // (Không thay đổi)
    // Chức năng này vẫn hoạt động vì nó querySelectorAll
    // mỗi khi người dùng gõ, nên sẽ luôn lấy được sản phẩm mới.
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const products = productList.querySelectorAll('.product-item');

            products.forEach(product => {
                const titleElement = product.querySelector('h3');
                if (titleElement) {
                    const title = titleElement.textContent.toLowerCase();
                    if (title.includes(searchTerm)) {
                        product.style.display = '';
                    } else {
                        product.style.display = 'none';
                    }
                }
            });
        });
    }

    // --- (CẬP NHẬT LỚN BÀI 4) Xử lý sự kiện Submit Form ---
    if (addForm && productList && errorMsg) { 
        addForm.addEventListener('submit', (event) => {
            // Ngăn hành vi mặc định của form (tải lại trang)
            event.preventDefault(); 
            
            // Ẩn thông báo lỗi cũ (nếu có)
            errorMsg.classList.add('hidden');
            errorMsg.textContent = '';

            // 1. Lấy giá trị từ các ô input
            const title = document.getElementById('newTitle').value;
            const imageUrl = document.getElementById('newImage').value;
            const description = document.getElementById('newDesc').value;
            const priceInput = document.getElementById('newPrice').value;

            // 2. (BỔ SUNG) Validation
            const priceValue = parseFloat(priceInput); // Vì input là type="number"

            // Kiểm tra Tên
            if (title.trim() === '') {
                errorMsg.textContent = 'Lỗi: Tên sản phẩm không được để trống.';
                errorMsg.classList.remove('hidden');
                return; // Dừng hàm
            }

            // Kiểm tra Giá (phải là số và lớn hơn 0)
            if (isNaN(priceValue) || priceValue <= 0) {
                errorMsg.textContent = 'Lỗi: Giá phải là một số hợp lệ lớn hơn 0.';
                errorMsg.classList.remove('hidden');
                return; // Dừng hàm
            }
            
            // (HTML 'required' đã xử lý các trường khác, nhưng ta có thể
            // kiểm tra thêm nếu muốn)
            if (imageUrl.trim() === '' || description.trim() === '') {
                 errorMsg.textContent = 'Lỗi: Vui lòng điền URL hình ảnh và Mô tả.';
                 errorMsg.classList.remove('hidden');
                 return;
            }

            // 3. Định dạng giá tiền (nếu validation thành công)
            // Sử dụng priceValue (số đã parse) thay vì priceInput (chuỗi)
            const formattedPrice = formatPrice(priceValue); 
            const displayPrice = `${formattedPrice} VND`; 

            // 4. Tạo phần tử HTML mới cho sản phẩm
            const newProduct = document.createElement('article');
            newProduct.classList.add('product-item');

            // 5. Đổ dữ liệu vào phần tử mới bằng innerHTML
            newProduct.innerHTML = `
                <img src="${imageUrl}" alt="${title} cover">
                <h3>${title}</h3>
                <p>${description}</p>
                <p class="price">${displayPrice}</p>
            `;

            // 6. Gắn phần tử sản phẩm mới vào ĐẦU danh sách (dùng prepend)
            // (Hoặc dùng appendChild để thêm vào cuối)
            productList.prepend(newProduct);
            
            console.log('Sản phẩm mới đã được thêm vào DOM:', { title, imageUrl, description, price: displayPrice });

            // 7. Xóa nội dung form và ẩn đi
            addForm.reset();
            addForm.classList.add('hidden');
            toggleBtn.textContent = 'Thêm sản phẩm';
        });
    }

});