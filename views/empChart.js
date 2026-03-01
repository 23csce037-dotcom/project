document.addEventListener("DOMContentLoaded", function () {

    const ctx = document.getElementById('candidateChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Training on-process',
                'Placement Ready'
            ],
            datasets: [{
                data: [56, 24],
                backgroundColor: [
                    '#0d6efd',
                    '#198754'
                ],
                borderWidth: 0,
                radius: '85%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

});
