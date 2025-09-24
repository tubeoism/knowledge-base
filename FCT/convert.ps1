# --- SCRIPT CHUYỂN ĐỔI CSV SANG JSON BẰNG POWERSHELL ---

# BƯỚC 1: Cấu hình đường dẫn file
# Vui lòng thay thế các đường dẫn ví dụ bên dưới bằng đường dẫn thật trên máy tính của bạn.

# Đường dẫn đến file CSV gốc
$csvFilePath = "registered_contractors.csv"

# Đường dẫn nơi bạn muốn lưu file JSON mới
$jsonFilePath = "registered_contractors.json"


# BƯỚC 2: Thực hiện chuyển đổi
# Lệnh này sẽ đọc file CSV, chuyển đổi nội dung thành định dạng JSON,
# và sau đó lưu vào file mới với mã hóa UTF-8 (chuẩn cho web).
try {
    Import-Csv -Path $csvFilePath | ConvertTo-Json | Out-File -FilePath $jsonFilePath -Encoding utf8
    
    # In ra thông báo thành công
    Write-Host "--------------------------------------------------" -ForegroundColor Green
    Write-Host "THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "File CSV đã được chuyển đổi thành công thành file JSON."
    Write-Host "File mới được lưu tại: $jsonFilePath"
    Write-Host "--------------------------------------------------" -ForegroundColor Green
}
catch {
    # In ra thông báo lỗi nếu có sự cố
    Write-Host "--------------------------------------------------" -ForegroundColor Red
    Write-Host "ĐÃ XẢY RA LỖI!" -ForegroundColor Red
    Write-Host "Không thể chuyển đổi file. Vui lòng kiểm tra lại:"
    Write-Host "- Đường dẫn file CSV có chính xác không?"
    Write-Host "- File CSV có tồn tại và không bị lỗi không?"
    Write-Host "Chi tiết lỗi: $_"
    Write-Host "--------------------------------------------------" -ForegroundColor Red
}
