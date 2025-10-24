// Chờ cho toàn bộ nội dung HTML được tải xong trước khi chạy script
document.addEventListener('DOMContentLoaded', () => {

    // --- (BỔ SUNG MỚI) Hàm định dạng giá tiền ---
    /**
     * Định dạng một số thành chuỗi có dấu phẩy ngăn cách hàng nghìn.
     * Ví dụ: 89000 -> "89,000"
     * @param {number | string} number - Số cần định dạng.
     * @returns {string} - Chuỗi đã định dạng.
     */
    function formatPrice(number) {
        // Chuyển đổi chuỗi (ví dụ "89000") thành số (89000)
        // parseFloat sẽ xử lý tốt cả trường hợp người dùng nhập "89000"
        const numericValue = parseFloat(number);

        // Kiểm tra nếu không phải là số hợp lệ (ví dụ: người dùng nhập "abc")
        if (isNaN(numericValue)) {
            // Trả về nguyên bản nếu không phải số. 
            // Hoặc bạn có thể trả về "0"
            return String(number); 
        }

        // Sử dụng API Intl.NumberFormat của JavaScript hiện đại
        // 'en-US' là locale (khu vực) sử dụng dấu phẩy (,) làm dải phân cách hàng nghìn
        // (Nếu dùng 'vi-VN', nó sẽ ra "89.000")
        return new Intl.NumberFormat('en-US').format(numericValue);
    }


    // --- Lấy các phần tử DOM chính ---
    const toggleBtn = document.getElementById('toggleFormBtn');
    const addForm = document.getElementById('addProductForm');
    const searchInput = document.getElementById('searchInput');
    // (BỔ SUNG) Lấy phần tử "cha" chứa danh sách sản phẩm
    const productList = document.querySelector('.product-list');


    // --- Chức năng 1: Ẩn/hiện Form Thêm Sản Phẩm ---
    
    // (Không thay đổi)
    if (toggleBtn && addForm) {
        toggleBtn.addEventListener('click', () => {
            addForm.classList.toggle('hidden');
            if (addForm.classList.contains('hidden')) {
                toggleBtn.textContent = 'Thêm sản phẩm';
            } else {
                toggleBtn.textContent = 'Đóng Form';
            }
        });
    }

    // --- Chức năng 2: Lọc/Tìm Kiếm Sản Phẩm ---
    
    // (Không thay đổi)
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            // (CẬP NHẬT) Lấy danh sách sản phẩm từ biến đã lưu
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

    // --- (CẬP NHẬT LỚN) Xử lý sự kiện Submit Form ---
    if (addForm && productList) { // Đảm bảo cả form và danh sách đều tồn tại
        addForm.addEventListener('submit', (event) => {
            // Ngăn hành vi mặc định của form (tải lại trang)
            event.preventDefault(); 
            
            // 1. Lấy giá trị từ các ô input
            const title = document.getElementById('newTitle').value;
            const imageUrl = document.getElementById('newImage').value;
            const description = document.getElementById('newDesc').value;
            const priceInput = document.getElementById('newPrice').value;

            // 2. Định dạng giá tiền
            const formattedPrice = formatPrice(priceInput); // Ví dụ: "89,000"
            const displayPrice = `${formattedPrice} VND`; // Ví dụ: "89,000 VND"

            // 3. (BỔ SUNG) Tạo phần tử HTML mới cho sản phẩm
            const newProduct = document.createElement('article');
            newProduct.classList.add('product-item');

            // 4. (BỔ SUNG) Đổ dữ liệu vào phần tử mới bằng innerHTML
            // (Cách này nhanh và dễ đọc)
            newProduct.innerHTML = `
                <img src="${imageUrl}" alt="${title} cover">
                <h3>${title}</h3>
                <p>${description}</p>
                <p class="price">${displayPrice}</p>
            `;

            // 5. (BỔ SUNG) Gắn phần tử sản phẩm mới vào cuối danh sách
            productList.appendChild(newProduct);
            
            // (ĐÃ XÓA) Xóa dòng alert theo yêu cầu
            // alert(`Đã thêm sản phẩm (Demo)! Giá: ${displayPrice}. Kiểm tra console (F12) để xem chi tiết.`);

            // (GIỮ LẠI) Dùng console.log để thông báo (hữu ích khi lập trình)
            console.log('Sản phẩm mới đã được thêm vào DOM:', { title, imageUrl, description, price: displayPrice });

            // 6. Xóa nội dung form và ẩn đi
            addForm.reset();
            addForm.classList.add('hidden');
            toggleBtn.textContent = 'Thêm sản phẩm';
        });
    }

});