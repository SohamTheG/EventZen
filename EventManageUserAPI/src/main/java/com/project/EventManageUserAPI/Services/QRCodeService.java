package com.project.EventManageUserAPI.Services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QRCodeService {

    public String generateQRCodeImage(String textToEncode) throws Exception {
        QRCodeWriter barcodeWriter = new QRCodeWriter();
        // Generate a 250x250 pixel QR code
        BitMatrix bitMatrix = barcodeWriter.encode(textToEncode, BarcodeFormat.QR_CODE, 250, 250);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        // Convert the raw image bytes into a Base64 string so we can save it in MySQL
        return Base64.getEncoder().encodeToString(pngData);
    }
}