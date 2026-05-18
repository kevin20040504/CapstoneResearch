import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../lib/api/client";

const AcademicContext = createContext(null);


export const AcademicProvider = ({ children }) => {
    const [academicYears, setAcademicYears] = useState([]);
    
    const fetchAcademicYears = async () => {
        try {
            const response = await apiClient.get('/academic-years');
            const data = response?.data;
            setAcademicYears(data);
        }catch (error) {
            console.error('Error fetching academic years:', error);
        }
    } 
    const laodAcademicYears =  async () => await fetchAcademicYears();
    useEffect(() => {
        fetchAcademicYears();
    }, []);
    return (
        <AcademicContext.Provider value={{
            academicYears,
            setAcademicYears,
            laodAcademicYears
        }}>
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
    const context = useContext(AcademicContext);
    if (!context) {
        throw new Error('useAcademic must be used within an AcademicProvider');
    }
    return context;
};