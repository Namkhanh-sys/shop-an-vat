$(document).ready(function() {
    const API_URL = 'https://67c7bf32c19eb8753e7a91a3.mockapi.io/api/v1/khanh';

    // Hàm render danh sách nhà
    function renderHouses(houses) {
        $('#house-list').empty();
        houses.forEach(house => {
            const row = `
                <tr>
                    <td>${house.id}</td>
                    <td>${house.name}</td>
                    <td class="info-group">
                        <span><strong>Giá:</strong> ${Number(house.price).toLocaleString('vi-VN')} VNĐ/tháng</span>
                        <span><strong>Diện tích:</strong> ${house.area} m²</span>
                        <span><strong>Địa chỉ:</strong> ${house.address}</span>
                        <span><strong>Phòng:</strong> ${house.bedrooms} ngủ, ${house.bathrooms} tắm</span>
                    </td>
                    <td><img src="${house.image}" alt="${house.name}" style="max-width: 100px;"></td>
                    <td>
                        <button class="btn btn-edit" data-id="${house.id}"><i class="fas fa-edit"></i> Sửa</button>
                        <button class="btn btn-delete" data-id="${house.id}"><i class="fas fa-trash-alt"></i> Xóa</button>
                    </td>
                </tr>
            `;
            $('#house-list').append(row);
        });
    }

    // Load danh sách nhà từ API
    function loadHouses() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(data) {
                renderHouses(data);
            },
            error: function(xhr) {
                alert('Lỗi khi tải danh sách nhà: ' + xhr.responseText);
            }
        });
    }

    // Hiển thị logo chung từ localStorage
    function loadSiteLogo() {
        const siteLogo = localStorage.getItem('siteLogo');
        if (siteLogo) {
            $('#header-logo').attr('src', siteLogo);
            $('#site-logo').val(siteLogo);
        }
    }

    // Cập nhật logo chung
    $('#update-logo-form').submit(function(e) {
        e.preventDefault();
        const siteLogo = $('#site-logo').val().trim();
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

        if (siteLogo && urlPattern.test(siteLogo)) {
            localStorage.setItem('siteLogo', siteLogo);
            $('#header-logo').attr('src', siteLogo).on('error', function() {
                alert('URL logo không hợp lệ hoặc không tải được ảnh!');
                $(this).attr('src', ''); // Xóa src nếu ảnh không tải được
                localStorage.removeItem('siteLogo');
            });
            alert('Cập nhật logo thành công!');
        } else {
            $('#header-logo').attr('src', ''); // Xóa logo nếu URL không hợp lệ
            localStorage.removeItem('siteLogo');
            alert('Vui lòng nhập URL logo hợp lệ!');
        }
    });

    // Thêm nhà mới
    $('#add-house-form').submit(function(e) {
        e.preventDefault();
        const newHouse = {
            name: $('#house-name').val(),
            price: $('#house-price').val(),
            area: $('#house-area').val(),
            address: $('#house-address').val(),
            bedrooms: $('#house-bedrooms').val(),
            bathrooms: $('#house-bathrooms').val(),
            image: $('#house-image').val()
        };
        $.ajax({
            url: API_URL,
            method: 'POST',
            data: newHouse,
            success: function() {
                alert('Thêm nhà thành công!');
                $('#add-house-form')[0].reset();
                loadHouses();
            },
            error: function(xhr) {
                alert('Lỗi khi thêm nhà: ' + xhr.responseText);
            }
        });
    });

    // Xử lý chỉnh sửa nhà
    $(document).on('click', '.btn-edit', function() {
        const id = $(this).data('id');
        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'GET',
            success: function(house) {
                $('#edit-house-id').val(house.id);
                $('#edit-house-name').val(house.name);
                $('#edit-house-price').val(house.price);
                $('#edit-house-area').val(house.area);
                $('#edit-house-address').val(house.address);
                $('#edit-house-bedrooms').val(house.bedrooms);
                $('#edit-house-bathrooms').val(house.bathrooms);
                $('#edit-house-image').val(house.image);
                $('#edit-modal').show();
            },
            error: function(xhr) {
                alert('Lỗi khi lấy chi tiết nhà: ' + xhr.responseText);
            }
        });
    });

    // Lưu thay đổi
    $('#edit-house-form').submit(function(e) {
        e.preventDefault();
        const id = $('#edit-house-id').val();
        const updatedHouse = {
            name: $('#edit-house-name').val(),
            price: $('#edit-house-price').val(),
            area: $('#edit-house-area').val(),
            address: $('#edit-house-address').val(),
            bedrooms: $('#edit-house-bedrooms').val(),
            bathrooms: $('#edit-house-bathrooms').val(),
            image: $('#edit-house-image').val()
        };
        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'PUT',
            data: updatedHouse,
            success: function() {
                alert('Cập nhật thành công!');
                $('#edit-modal').hide();
                loadHouses();
            },
            error: function(xhr) {
                alert('Lỗi khi cập nhật: ' + xhr.responseText);
            }
        });
    });

    // Xóa nhà
    $(document).on('click', '.btn-delete', function() {
        if (confirm('Bạn có chắc muốn xóa nhà này?')) {
            const id = $(this).data('id');
            $.ajax({
                url: `${API_URL}/${id}`,
                method: 'DELETE',
                success: function() {
                    loadHouses();
                },
                error: function(xhr) {
                    alert('Lỗi khi xóa nhà: ' + xhr.responseText);
                }
            });
        }
    });

    // Đóng modal
    $('.close-btn').on('click', function() {
        $('#edit-modal').hide();
    });

    $(window).on('click', function(e) {
        if ($(e.target).is('#edit-modal')) {
            $('#edit-modal').hide();
        }
    });

    // Load danh sách ban đầu và logo chung
    loadHouses();
    loadSiteLogo();
});
