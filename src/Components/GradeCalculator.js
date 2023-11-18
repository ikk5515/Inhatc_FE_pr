import React, { useState } from 'react';
import './css/GradeCalculator.css'; // Import the CSS file

const GradeCalculator = () => {
  const initialData = [
  ];

  const [classification, setClassification] = useState('General Education');
  const [requiredCategory, setRequiredCategory] = useState('Required');
  const [error, setError] = useState('');

  const [dataGrade1, setDataGrade1] = useState(initialData.filter((row) => row.grade === '1'));
  const [dataGrade2, setDataGrade2] = useState(initialData.filter((row) => row.grade === '2'));
  const [dataGrade3, setDataGrade3] = useState(initialData.filter((row) => row.grade === '3'));

  const addRow = (grade) => {
    const newData = {
      completed: '',
      required: '',
      courseName: '',
      credits: 1,
      attendance: 0,
      assignment: 0,
      midterm: 0,
      final: 0,
      grade,
    };

    switch (grade) {
      case '1':
        setDataGrade1([...dataGrade1, newData]);
        break;
      case '2':
        setDataGrade2([...dataGrade2, newData]);
        break;
      case '3':
        setDataGrade3([...dataGrade3, newData]);
        break;
      default:
        break;
    }
  };

  const deleteRow = (grade, index) => {
    switch (grade) {
      case '1':
        const newDataGrade1 = [...dataGrade1];
        newDataGrade1.splice(index, 1);
        setDataGrade1(newDataGrade1);
        break;
      case '2':
        const newDataGrade2 = [...dataGrade2];
        newDataGrade2.splice(index, 1);
        setDataGrade2(newDataGrade2);
        break;
      case '3':
        const newDataGrade3 = [...dataGrade3];
        newDataGrade3.splice(index, 1);
        setDataGrade3(newDataGrade3);
        break;
      default:
        break;
    }
  };

  const [totalAndAverage, setTotalAndAverage] = useState({
    total1: 0,
    average1: 0,
    total2: 0,
    average2: 0,
    total3: 0,
    average3: 0,
  });

  const saveData = (grade) => {
    let newData;
    switch (grade) {
      case '1':
        newData = calculateAndSortData(dataGrade1);
        setDataGrade1(newData);
        break;
      case '2':
        newData = calculateAndSortData(dataGrade2);
        setDataGrade2(newData);
        break;
      case '3':
        newData = calculateAndSortData(dataGrade3);
        setDataGrade3(newData);
        break;
      default:
        break;
    }
  };

  const calculateAndSortData = (data) => {
    let totalCredits = 0;
    let avrPoints = 0;
    let totalAverage = 0;
    let totalGrade = 0;

    const newData = data.map((row) => {
      const totalPoints = parseInt(row.attendance) + parseInt(row.assignment) + parseInt(row.midterm) + parseInt(row.final);
      const grade = calculateGrade(row.credits, totalPoints);
      return { ...row, total: totalPoints, average: totalPoints / 4, grade };
    }).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed.localeCompare(b.completed);
      if (a.required !== b.required) return a.required.localeCompare(b.required);
      return a.courseName.localeCompare(b.courseName);
    });

    setError('');
    return newData;
  };

  const calculateTotal = (grade) => {
    const data = getDataByGrade(grade);
    return data.reduce((total, row) => total + (row.total || 0), 0);
  };
  
  const calculateAverage = (grade) => {
    const data = getDataByGrade(grade);
  
    // Filter out rows with Credits equal to 1
    const filteredData = data.filter((row) => parseInt(row.credits) !== 1);
  
    // Calculate total credits and total points for the filtered data
    const totalCredits = filteredData.reduce((total, row) => parseInt(total) + parseInt(row.credits || 0), 0);
    const totalPoints = filteredData.reduce((total, row) => parseInt(total) + parseInt(row.total || 0), 0);
  
    // Avoid division by zero
    if (totalCredits === 0) {
      return 0;
    }
  
    return totalPoints / parseInt(filteredData.length);
  };
  
  
  const getDataByGrade = (grade) => {
    switch (grade) {
      case '1':
        return dataGrade1;
      case '2':
        return dataGrade2;
      case '3':
        return dataGrade3;
      default:
        return [];
    }
  };
  
  const calculateTotalSum = (grade, field) => {
    const data = getDataByGrade(grade);
    return data.reduce((total, row) => parseInt(total) + (parseInt(row[field]) || 0), 0);
  };

  const calculateGrade = (credits, totalPoints) => {
    const gradeValue = totalPoints / credits;
    if (totalPoints >= 95) {
      return 'A+';
    } else if (totalPoints >= 90) {
      return 'A0';
    } else if (totalPoints >= 85) {
      return 'B+';
    } else if (totalPoints >= 80) {
      return 'B0';
    } else if (totalPoints >= 75) {
      return 'C+';
    } else if (totalPoints >= 70) {
      return 'C0';
    } else if (totalPoints >= 65) {
      return 'D+';
    } else if (totalPoints >= 60) {
      return 'D0';
    } else {
      return 'F';
    }
  };
  
  
  
  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };
  

  const handleClassificationChange = (event) => {
    setClassification(event.target.value);
  };

  const handleRequiredCategoryChange = (event) => {
    setRequiredCategory(event.target.value);
  };

  const handleInputChange = (grade, index, field, value) => {
    let newData;
  
    switch (grade) {
      case '1':
        newData = [...dataGrade1];
        break;
      case '2':
        newData = [...dataGrade2];
        break;
      case '3':
        newData = [...dataGrade3];
        break;
      default:
        break;
    }
  
    // Check for duplicate "Course Name" values within the same grade
    const isDuplicateCourseName = newData.some((row, i) => i !== index && row.courseName === value);
    if (isDuplicateCourseName) {
      setError(`Duplicate "Course Name" values are not allowed within Grade ${grade}.`);
      return;
    }
  
    // Update the specific field in the data
    newData[index][field] = value;
  
    // Update the state based on the grade
    switch (grade) {
      case '1':
        setDataGrade1(newData);
        break;
      case '2':
        setDataGrade2(newData);
        break;
      case '3':
        setDataGrade3(newData);
        break;
      default:
        break;
    }
  
    // Clear the error
    setError('');
  };
  
  
  
  
  
  


  const renderGradeTable = (grade, data, setData, saveDataFn, addRowFn, deleteRowFn) => (
    <div>
      <h2>{`${grade}학년`}</h2>
      <button className="action-button" onClick={() => addRowFn(grade)}>추가</button>
      <button className="action-button" onClick={() => saveDataFn(grade)}>저장</button>
      <table>
        {/* Table header */}
        <thead>
          <tr>
            <th>이수</th>
            <th>필수</th>
            <th>과목명</th>
            <th>학점</th>
            <th>출석점수</th>
            <th>과제점수</th>
            <th>중간고사</th>
            <th>기말고사</th>
            <th>총점</th>
            <th>평군</th>
            <th>성적</th>
            <th colSpan="3">삭제</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>
                <select
                  type="text"
                  value={row.completed}
                  onChange={(e) => handleInputChange(grade, index, 'completed', e.target.value)}
                >
                  <option value="Liberal Arts">교양</option>
                  <option value="Majors">전공</option>
                </select>
              </td>
              <td>
                <select
                  type="text"
                  value={row.required}
                  onChange={(e) => handleInputChange(grade, index, 'required', e.target.value)}
                >
                  <option value="Required">필수</option>
                  <option value="Optional">선택</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={row.courseName}
                  onChange={(e) => handleInputChange(grade, index, 'courseName', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.credits}
                  onChange={(e) => handleInputChange(grade, index, 'credits', clamp(e.target.value, 1, 5))}
                  min="1"
                  max="5"
                />
              </td>
              {row.credits === 1 ? (
              <>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              </>
          ) : (
            <>
              <td>
                <input
                  type="number"
                  value={row.attendance}
                  onChange={(e) => handleInputChange(grade, index, 'attendance', clamp(e.target.value, 0, 20))}
                  min="0"
                  max="20"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.assignment}
                  onChange={(e) => handleInputChange(grade, index, 'assignment', clamp(e.target.value, 0, 20))}
                  min="0"
                  max="20"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.midterm}
                  onChange={(e) => handleInputChange(grade, index, 'midterm', clamp(e.target.value, 0, 30))}
                  min="0"
                  max="30"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.final}
                  onChange={(e) => handleInputChange(grade, index, 'final', clamp(e.target.value, 0, 30))}
                  min="0"
                  max="30"
                />
              </td>
              </>
          )}
              <td>{row.total}</td>
              <td>
              </td>
              <td style={{ color: (row.grade === 'F' && row.credits !== 1) || row.grade === 'NP' ? 'red' : 'inherit' }}>
                {row.credits === 1 ? 'P' : row.grade}
              </td>
              <td>
                <button className="delete-button" onClick={() => deleteRowFn(grade, index)}>삭제</button>
                </td>
            </tr>
          ))}
        </tbody>
        <tbody>
          <tr>
            <td colSpan="3" style={{ textAlign: 'center' }}>합계</td>
            <td>{calculateTotalSum(grade, 'credits')}</td>
            <td>{calculateTotalSum(grade, 'attendance')}</td>
            <td>{calculateTotalSum(grade, 'assignment')}</td>
            <td>{calculateTotalSum(grade, 'midterm')}</td>
            <td>{calculateTotalSum(grade, 'final')}</td>
            <td>{calculateTotalSum(grade, 'total')}</td>
            <td>{calculateAverage(grade).toFixed(2)}</td>
            <td>{calculateGrade(
              calculateTotalSum(grade, 'credits'),
              calculateAverage(grade, data),
              )}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="grade-calculator-container">
      {renderGradeTable('1', dataGrade1, setDataGrade1, saveData, addRow, deleteRow)}
      {renderGradeTable('2', dataGrade2, setDataGrade2, saveData, addRow, deleteRow)}
      {renderGradeTable('3', dataGrade3, setDataGrade3, saveData, addRow, deleteRow)}
    </div>
  );
};

export default GradeCalculator;
