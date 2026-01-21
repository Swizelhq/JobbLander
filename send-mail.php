<?php
// 1. Force error reporting for local VS Code debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// 2. Load PHPMailer files
require __DIR__ . '/src/Exception.php';
require __DIR__ . '/src/PHPMailer.php';
require __DIR__ . '/src/SMTP.php';

header('Content-Type: application/json');

// 3. Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Direct access not allowed']);
    exit;
}

// 4. Capture Form Data (Recognizes fname/lname from both forms)
$fname   = htmlspecialchars(trim($_POST['fname'] ?? ''));
$lname   = htmlspecialchars(trim($_POST['lname'] ?? ''));
$phone   = htmlspecialchars(trim($_POST['phone'] ?? ''));
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

try {
    $mail = new PHPMailer(true);

    // --- SERVER SETTINGS ---
    $mail->isSMTP();
    $mail->Host       = '147.124.214.6'; // Direct IP bypass for Cloudflare
    $mail->SMTPAuth   = true;
    $mail->Username   = 'support@jobblander.com';
    $mail->Password   = 'Ndike007#&'; 
    $mail->SMTPSecure = 'tls'; 
    $mail->Port       = 587; 
    $mail->Timeout    = 25;

    // --- LOCALHOST SSL BYPASS ---
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    // --- SMART ROUTING LOGIC ---
    // If the message contains "SERVICES:", it's from the Pricing page application.
    if (strpos($message, 'SERVICES:') !== false) {
        $recipientEmail = 'apply@jobblander.com';
        $subjectTitle   = "New Application";
    } else {
        $recipientEmail = 'support@jobblander.com';
        $subjectTitle   = "New Contact Lead";
    }

    // --- EMAIL TO JOBBLANDER ---
    $mail->setFrom('support@jobblander.com', 'JobbLander Website');
    $mail->addAddress($recipientEmail); // Sends to apply@ or support@ based on form
    $mail->addReplyTo($email, "$fname $lname");

    $mail->isHTML(true);
    $mail->Subject = "$subjectTitle: $fname $lname";
    $mail->Body    = "
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;'>
            <h2 style='color: #ec4899;'>$subjectTitle</h2>
            <p><b>Name:</b> $fname $lname</p>
            <p><b>Phone:</b> $phone</p>
            <p><b>Email:</b> $email</p>
            <hr>
            <p><b>Message/Details:</b><br>" . nl2br($message) . "</p>
        </div>";

    $mail->send();

    // --- AUTO-REPLY TO CUSTOMER ---
    $mail->clearAddresses();
    $mail->addAddress($email);
    $mail->Subject = 'Confirmation: We received your inquiry at Jobblander';
    $mail->Body    = "
        <div style='font-family: sans-serif; line-height: 1.6; color: #333;'>
            <h2>Hello $fname,</h2>
            <p>Thank you for reaching out to <strong>Jobblander</strong>. This is an automated confirmation to let you know that our team has successfully received your message.</p>
            <p>One of our career consultants will review your inquiry and get back to you within 24-48 business hours.</p>
            <p>Best Regards,<br><strong>The Jobblander Team</strong></p>
        </div>";

    $mail->send();

    // --- SUCCESS RESPONSE (This closes the SweetAlert loading box) ---
    echo json_encode(['status' => 'success']);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => "SMTP Error: {$mail->ErrorInfo}"]);
}