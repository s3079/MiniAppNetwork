document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('supportForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            priority: form.priority.value,
            message: form.message.value.trim()
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Here you would typically send the data to your backend
        // For now, we'll just log it and show a success message
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you! Your support request has been submitted.');
        
        // Reset form
        form.reset();
    });

    // Optional: Add input validation as user types
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('error');
            }
        });
    });
});
