<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABSteak Customer Support - Chatwoot</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .hero-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card-shadow {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <div class="hero-gradient text-white">
            <div class="max-w-6xl mx-auto px-4 py-8">
                <div class="text-center">
                    <div class="flex items-center justify-center mb-4">
                        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold text-2xl">AB</span>
                        </div>
                    </div>
                    <h1 class="text-4xl font-bold mb-2">ABSteak Customer Support</h1>
                    <p class="text-xl opacity-90">Get instant help from our support team</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Welcome Section -->
                <div class="bg-white rounded-lg card-shadow p-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Welcome to Our Support Center</h2>
                    <div class="space-y-4 text-gray-600">
                        <p>Our customer support team is here to help you with:</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>Order inquiries and tracking</li>
                            <li>Menu questions and recommendations</li>
                            <li>Reservation assistance</li>
                            <li>Account and billing support</li>
                            <li>Technical issues</li>
                            <li>General feedback and suggestions</li>
                        </ul>
                        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 class="font-semibold text-blue-800 mb-2">💬 Live Chat Available</h3>
                            <p class="text-blue-700 text-sm">Click the chat widget in the bottom right corner to start a conversation with our support team.</p>
                        </div>
                    </div>
                </div>

                <!-- Support Hours -->
                <div class="bg-white rounded-lg card-shadow p-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Support Hours</h2>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-medium text-gray-700">Monday - Friday</span>
                            <span class="text-gray-600">9:00 AM - 8:00 PM</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-medium text-gray-700">Saturday</span>
                            <span class="text-gray-600">10:00 AM - 6:00 PM</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="font-medium text-gray-700">Sunday</span>
                            <span class="text-gray-600">12:00 PM - 5:00 PM</span>
                        </div>
                    </div>
                    
                    <div class="mt-6 p-4 bg-green-50 rounded-lg">
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span class="font-semibold text-green-800">We're Online Now!</span>
                        </div>
                        <p class="text-green-700 text-sm mt-1">Average response time: 2-3 minutes</p>
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="mt-8 bg-white rounded-lg card-shadow p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-semibold text-gray-800 mb-2">How do I track my order?</h3>
                            <p class="text-gray-600 text-sm">You can track your order using the tracking number sent to your email, or contact us through the chat widget.</p>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800 mb-2">What are your delivery hours?</h3>
                            <p class="text-gray-600 text-sm">We deliver from 11:00 AM to 10:00 PM daily. Delivery times may vary based on location and demand.</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-semibold text-gray-800 mb-2">Can I modify my order?</h3>
                            <p class="text-gray-600 text-sm">Orders can be modified within 5 minutes of placement. Contact us immediately through chat for assistance.</p>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800 mb-2">Do you offer refunds?</h3>
                            <p class="text-gray-600 text-sm">Yes, we offer refunds for valid reasons. Please contact our support team to discuss your specific situation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-6">
            <div class="max-w-6xl mx-auto px-4 text-center">
                <p>&copy; 2024 ABSteak. All rights reserved.</p>
                <p class="text-gray-400 text-sm mt-1">Need help? Use the chat widget or email us at support@absteak.com</p>
            </div>
        </footer>
    </div>

    <!-- Chatwoot Widget Script -->
    <script>
        // Chatwoot configuration
        (function(d, t) {
            var BASE_URL = "http://localhost:3002"; // Chatwoot server URL
            var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
            g.src = BASE_URL + "/packs/js/sdk.js";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g, s);
            g.onload = function() {
                window.chatwootSDK.run({
                    websiteToken: "{{ env('CHATWOOT_WEBSITE_TOKEN', 'your-website-token-here') }}",
                    baseUrl: BASE_URL,
                });
            };
        })(document, "script");

        // Chatwoot widget settings
        window.chatwootSettings = {
            hideMessageBubble: false,
            position: "right",
            locale: "en",
            type: "standard",
            darkMode: "auto",
            welcomeTitle: "Need help?",
            welcomeDescription: "We're here to support you with ABSteak services.",
            availableMessage: "We're online and ready to chat!",
            unavailableMessage: "We're currently offline. Leave us a message!"
        };

        // Listen to Chatwoot events
        window.addEventListener("chatwoot:ready", function () {
            console.log("Chatwoot widget is ready");
        });

        window.addEventListener('chatwoot:on-message', function(e) {
            console.log('New message received:', e.detail);
        });
    </script>
</body>
</html>