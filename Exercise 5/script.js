// Chờ cho toàn bộ nội dung HTML được tải xong trước khi chạy script
document.addEventListener('DOMContentLoaded', () => {

    const STORAGE_KEY = 'products'; // Key để lưu trong localStorage

    // Dữ liệu mẫu (lấy từ file HTML cũ)
    const defaultProducts = [
        { 
            title: 'My Sweet Orange Tree', 
            imageUrl: 'https://teachingbooks.com/content/ingram_images_hi/9/1536203289.jpg', 
            description: 'A touching story about childhood and growing up.', 
            price: 86000 
        },
        { 
            title: 'How to Win Friends and Influence People', 
            imageUrl: 'https://m.media-amazon.com/images/I/51PWIy1rHUL._SL500_.jpg', 
            description: 'Communication and social skills to succeed in life.', 
            price: 99000 
        },
        { 
            title: 'The Alchemist', 
            imageUrl: 'https://i.harperapps.com/hcanz/covers/9780062315007/y648.jpg', 
            description: 'A classic novel about the journey of a shepherd boy named Santiago pursuing his destiny.', 
            price: 79000 
        }
        // Lưu ý: Sản phẩm mới sẽ được thêm vào ĐẦU mảng, nên ta đảo thứ tự
        // các sản phẩm mẫu để "The Alchemist" xuất hiện cuối cùng (cũ nhất).
    ];
    let productsData = []; 

    // --- Lấy các phần tử DOM chính ---
    const toggleBtn = document.getElementById('toggleFormBtn');
    const addForm = document.getElementById('addProductForm');
    const searchInput = document.getElementById('searchInput');
    const productList = document.querySelector('.product-list');
    const cancelBtn = document.getElementById('cancelBtn');
    const errorMsg = document.getElementById('formError');

    
    // --- (BỔ SUNG BÀI 5) Các hàm quản lý dữ liệu ---

    /**
     * Hàm định dạng giá tiền (không đổi)
     */
    function formatPrice(number) {
        const numericValue = parseFloat(number);
        if (isNaN(numericValue)) {
            return String(number); 
        }
        return new Intl.NumberFormat('en-US').format(numericValue);
    }

    /**
     * (MỚI) Lưu mảng productsData hiện tại vào localStorage
     */
    function saveProducts() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productsData));
    }

    /**
     * (MỚI) Tạo HTML cho 1 đối tượng sản phẩm
     * @param {object} product - Đối tượng sản phẩm (có title, imageUrl, description, price)
     * @returns {HTMLElement} - Phần tử <article> đã sẵn sàng để chèn vào DOM
     */
    function createProductElement(product) {
        const productElement = document.createElement('article');
        productElement.classList.add('product-item');
        
        // Định dạng giá tiền để hiển thị
        const displayPrice = `${formatPrice(product.price)} VND`;
        
        productElement.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title} cover">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p class="price">${displayPrice}</p>
        `;
        return productElement;
    }

    /**
     * (MỚI) Vẽ lại toàn bộ danh sách sản phẩm lên UI từ mảng productsData
     */
    function renderProductList() {
        // Xóa sạch danh sách hiện tại trong DOM
        productList.innerHTML = ''; 
        
        // Lặp qua mảng data và tạo phần tử cho từng sản phẩm
        // (Chúng ta thêm vào cuối, nên mảng productsData 
        // cần được sắp xếp theo thứ tự [mới nhất, ..., cũ nhất])
        productsData.forEach(product => {
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        });
    }

    /**
     * (MỚI) Tải sản phẩm từ localStorage hoặc dùng dữ liệu mẫu
     */
    function loadProducts() {
        const savedProducts = localStorage.getItem(STORAGE_KEY);
        
        if (savedProducts) {
            // Nếu có dữ liệu, parse JSON và gán vào mảng
            productsData = JSON.parse(savedProducts);
        } else {
            // Nếu không có, dùng dữ liệu mẫu và lưu lại
            productsData = defaultProducts;
            saveProducts(); // Lưu sản phẩm mẫu vào storage cho lần sau
        }
        
        // Sau khi có dữ liệu, vẽ ra màn hình
        renderProductList();
    }


    // --- Chức năng 1: Ẩn/hiện Form (không thay đổi) ---
    if (toggleBtn && addForm) {
        toggleBtn.addEventListener('click', () => {
            addForm.classList.toggle('hidden');
            if (addForm.classList.contains('hidden')) {
                toggleBtn.textContent = 'Thêm sản phẩm';
                if(errorMsg) errorMsg.classList.add('hidden');
            } else {
                toggleBtn.textContent = 'Đóng Form';
            }
        });
    }

    // --- Chức năng Hủy Form (không thay đổi) ---
    if (cancelBtn && addForm && toggleBtn && errorMsg) {
        cancelBtn.addEventListener('click', () => {
            addForm.reset();
            addForm.classList.add('hidden');
            errorMsg.classList.add('hidden');
            toggleBtn.textContent = 'Thêm sản phẩm';
        });
    }

    // --- Chức năng 2: Lọc/Tìm Kiếm (không thay đổi) ---
    // Chức năng này vẫn hoạt động tốt vì nó querySelectorAll
    // các phần tử .product-item đã được render ra DOM.
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            // Lấy danh sách sản phẩm TỪ DOM (đã được render)
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


    // --- (CẬP NHẬT LỚN BÀI 5) Xử lý sự kiện Submit Form ---
    if (addForm && productList && errorMsg) { 
        addForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            
            errorMsg.classList.add('hidden');
            errorMsg.textContent = '';

            // 1. Lấy giá trị (không đổi)
            const title = document.getElementById('newTitle').value.trim();
            const imageUrl = document.getElementById('newImage').value.trim();
            const description = document.getElementById('newDesc').value.trim();
            const priceInput = document.getElementById('newPrice').value;

            // 2. Validation (không đổi)
            const priceValue = parseFloat(priceInput);

            if (title === '') {
                errorMsg.textContent = 'Lỗi: Tên sản phẩm không được để trống.';
                errorMsg.classList.remove('hidden');
                return;
            }
            if (isNaN(priceValue) || priceValue <= 0) {
                errorMsg.textContent = 'Lỗi: Giá phải là một số hợp lệ lớn hơn 0.';
                errorMsg.classList.remove('hidden');
                return;
            }
            if (imageUrl === '' || description === '') {
                 errorMsg.textContent = 'Lỗi: Vui lòng điền URL hình ảnh và Mô tả.';
                 errorMsg.classList.remove('hidden');
                 return;
            }

            // --- (THAY ĐỔI) Thay vì tạo HTML, ta tạo đối tượng ---

            // 3. Tạo đối tượng sản phẩm mới
            const newProduct = {
                title: title,
                imageUrl: imageUrl,
                description: description,
                price: priceValue // Lưu số (number) chứ không phải chuỗi đã định dạng
            };

            // 4. Thêm đối tượng vào ĐẦU mảng dữ liệu (dùng unshift)
            productsData.unshift(newProduct);

            // 5. Lưu mảng mới vào localStorage
            saveProducts();

            // 6. Vẽ lại toàn bộ danh sách từ mảng dữ liệu
            renderProductList();
            
            // 7. Xóa nội dung form và ẩn đi (không đổi)
            addForm.reset();
            addForm.classList.add('hidden');
            toggleBtn.textContent = 'Thêm sản phẩm';
        });
    }

    // --- (BỔ SUNG BÀI 5) Khởi chạy ứng dụng ---
    
    // Gọi hàm loadProducts() khi trang vừa tải xong
    loadProducts();

});