
let extensionApplied = false;

window.addEventListener('load', function() {
  setTimeout(addAttendanceCalculatorColumn, 500);
});

function addAttendanceCalculatorColumn() {
  if (extensionApplied) {
    return;
  }

  const table = document.querySelector('.table.table-bordered');
  
  if (!table) {
    console.log('Attendance table not found');
    return;
  }

  const headerRow = table.querySelector('thead tr');
  if (headerRow && headerRow.querySelector('th:last-child').textContent.includes('Bunk/Attend')) {
    extensionApplied = true;
    return;
  }

  if (headerRow) {
    const visualHeader = document.createElement('th');
    visualHeader.innerHTML = 'Visual Progress';
    visualHeader.style.width = '10%';
    visualHeader.style.textAlign = 'center';
    visualHeader.setAttribute('data-extension-column', 'true');
    headerRow.appendChild(visualHeader);
  }

  if (headerRow) {
    const statusHeader = document.createElement('th');
    statusHeader.innerHTML = 'Bunk/Attend Status';
    statusHeader.style.width = '15%';
    statusHeader.style.textAlign = 'center';
    statusHeader.setAttribute('data-extension-column', 'true');
    headerRow.appendChild(statusHeader);
  }

  const dataRows = table.querySelectorAll('tbody tr');
  
  const courseGroups = new Map();
  
  dataRows.forEach((row, index) => {
    if (row.querySelector('[data-extension-column="true"]')) {
      return;
    }

    if (row.style.fontWeight === '500' || row.querySelector('td[colspan]')) {
      return;
    }
    const codeCell = row.cells[3];
    if (!codeCell) return;
    
    const courseCode = codeCell.textContent.trim();
    
    const attendanceCell = row.cells[4];
    if (!attendanceCell) return;
    
    const attendanceText = attendanceCell.textContent.trim();
    const match = attendanceText.match(/(\d+)\/(\d+)/);
    
    if (!match) return;
    
    const attended = parseInt(match[1]);
    const delivered = parseInt(match[2]);
    
    if (!courseGroups.has(courseCode)) {
      courseGroups.set(courseCode, {
        rows: [],
        totalAttended: 0,
        totalDelivered: 0
      });
    }
    
    const group = courseGroups.get(courseCode);
    group.rows.push(row);
    group.totalAttended += attended;
    group.totalDelivered += delivered;
  });
  
  courseGroups.forEach((group, courseCode) => {
    const { rows, totalAttended, totalDelivered } = group;
    
    const combinedPercent = (totalAttended / totalDelivered) * 100;
    
    const status = calculateBunkStatus(totalAttended, totalDelivered, combinedPercent);
    
    const firstRow = rows[0];
    
    const visualCell = document.createElement('td');
    visualCell.style.textAlign = 'center';
    visualCell.style.verticalAlign = 'middle';
    visualCell.setAttribute('data-extension-column', 'true');
    
    if (rows.length > 1) {
      visualCell.rowSpan = rows.length;
    }
    visualCell.innerHTML = createProgressCircle(combinedPercent);
    firstRow.appendChild(visualCell);
    
    const statusCell = document.createElement('td');
    statusCell.style.textAlign = 'center';
    statusCell.style.verticalAlign = 'middle';
    statusCell.style.fontWeight = 'bold';
    statusCell.innerHTML = status.html;
    statusCell.className = status.className;
    statusCell.setAttribute('data-extension-column', 'true');
    
    if (rows.length > 1) {
      statusCell.rowSpan = rows.length;
    }
    firstRow.appendChild(statusCell);
    
    for (let i = 1; i < rows.length; i++) {
      
      rows[i].setAttribute('data-extension-processed', 'true');
    }
  });
  
  const totalRow = Array.from(dataRows).find(row => 
    row.style.fontWeight === '500' || row.querySelector('td[colspan]')
  );
  
  if (totalRow && !totalRow.querySelector('[data-extension-column="true"]')) {
    const visualCell = document.createElement('td');
    visualCell.innerHTML = '-';
    visualCell.style.textAlign = 'center';
    visualCell.style.verticalAlign = 'middle';
    visualCell.setAttribute('data-extension-column', 'true');
    totalRow.appendChild(visualCell);

    const statusCell = document.createElement('td');
    statusCell.innerHTML = '-';
    statusCell.style.textAlign = 'center';
    statusCell.style.verticalAlign = 'middle';
    statusCell.setAttribute('data-extension-column', 'true');
    totalRow.appendChild(statusCell);
  }

  extensionApplied = true;
}

function calculateBunkStatus(attended, delivered, currentPercent) {
  const targetPercent = 75;
  
  if (currentPercent >= targetPercent) {
    
    let canBunk = 0;
    let tempAttended = attended;
    let tempDelivered = delivered;
    
    while (true) {
      tempDelivered++;
      const newPercent = (tempAttended / tempDelivered) * 100;
      
      if (newPercent < targetPercent) {
        break;
      }
      canBunk++;
    }
    
    return {
      html: `<span class="bunk-safe">✓ Can bunk ${canBunk} class${canBunk !== 1 ? 'es' : ''}</span>`,
      className: 'status-safe'
    };
  } else {
   
    let needToAttend = 0;
    let tempAttended = attended;
    let tempDelivered = delivered;
    
    while (true) {
      tempAttended++;
      tempDelivered++;
      const newPercent = (tempAttended / tempDelivered) * 100;
      needToAttend++;
      
      if (newPercent >= targetPercent) {
        break;
      }
      
      if (needToAttend > 1000) {
        return {
          html: '<span class="bunk-warning">⚠ Need many classes</span>',
          className: 'status-warning'
        };
      }
    }
    
    return {
      html: `<span class="bunk-danger">✗ Attend ${needToAttend} class${needToAttend !== 1 ? 'es' : ''}</span>`,
      className: 'status-danger'
    };
  }
}

function createProgressCircle(percentage) {
  let color;
  let bgColor;
  
  if (percentage >= 90) {
    color = '#28a745'; 
    bgColor = '#d4edda';
  } else if (percentage >= 80) {
    color = '#20c997'; 
    bgColor = '#d1ecf1';
  } else if (percentage >= 75) {
    color = '#ffc107'; 
    bgColor = '#fff3cd';
  } else if (percentage >= 70) {
    color = '#fd7e14'; 
    bgColor = '#ffe5d0';
  } else {
    color = '#dc3545'; 
    bgColor = '#f8d7da';
  }
  
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return `
    <div class="progress-circle-container">
      <svg width="70" height="70" class="progress-ring">
        <circle
          class="progress-ring-bg"
          stroke="${bgColor}"
          stroke-width="5"
          fill="transparent"
          r="${radius}"
          cx="35"
          cy="35"
        />
        <circle
          class="progress-ring-circle"
          stroke="${color}"
          stroke-width="5"
          fill="transparent"
          r="${radius}"
          cx="35"
          cy="35"
          style="
            stroke-dasharray: ${circumference} ${circumference};
            stroke-dashoffset: ${offset};
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            transition: stroke-dashoffset 0.5s ease;
          "
        />
      </svg>
      <div class="progress-text" style="color: ${color};">${percentage.toFixed(1)}%</div>
    </div>
  `;
}
