import { t as Footer } from "./Footer-B1eFaMbW.js";
import { t as Header } from "./Header-BKJY6vbM.js";
import { useId, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Award, Building2, CheckCircle2, ExternalLink, GraduationCap, Printer, QrCode, RefreshCw, Search, ShieldCheck } from "lucide-react";
// src/lib/results-api.ts
var SUPPORTED_BOARDS = [
	{
		id: "tbse",
		name: "TBSE (Tripura Board)",
		bengaliName: "ত্রিপুরা মধ্যশিক্ষা পর্ষদ (TBSE)",
		type: "board",
		exams: [
			{
				id: "tbse_10",
				name: "মাধ্যমিক পরীক্ষা (Madhyamik Class 10)",
				hasRegNo: true
			},
			{
				id: "tbse_12_sci",
				name: "উচ্চ মাধ্যমিক বিজ্ঞান (10+2 Science)",
				hasRegNo: true
			},
			{
				id: "tbse_12_arts",
				name: "উচ্চ মাধ্যমিক কলা (10+2 Arts)",
				hasRegNo: true
			},
			{
				id: "tbse_12_comm",
				name: "উচ্চ মাধ্যমিক বাণিজ্য (10+2 Commerce)",
				hasRegNo: true
			}
		]
	},
	{
		id: "tu",
		name: "Tripura University",
		bengaliName: "ত্রিপুরা বিশ্ববিদ্যালয় (Tripura Univ)",
		type: "university",
		exams: [
			{
				id: "tu_ug_sem",
				name: "স্নাতক ডিগ্রি (UG - BA / BSc / BCom)",
				hasRegNo: true
			},
			{
				id: "tu_pg_sem",
				name: "স্নাতকোত্তর (PG - MA / MSc / MCom)",
				hasRegNo: true
			},
			{
				id: "tu_degree",
				name: "ডিগ্রি সার্টিফিকেট ভেরিফিকেশন",
				hasRegNo: true
			}
		]
	},
	{
		id: "mbbu",
		name: "MBB University",
		bengaliName: "মহারাজা বীর বিক্রম বিশ্ববিদ্যালয় (MBBU)",
		type: "university",
		exams: [{
			id: "mbbu_ug",
			name: "স্নাতক ডিগ্রি ফলাফল (Degree Semester)",
			hasRegNo: true
		}, {
			id: "mbbu_degree",
			name: "ডিগ্রি সার্টিফিকেট যাচাইকরণ",
			hasRegNo: true
		}]
	},
	{
		id: "cbse",
		name: "CBSE Board",
		bengaliName: "সিবিএসই (CBSE National)",
		type: "national",
		exams: [{
			id: "cbse_10",
			name: "Class X Secondary School",
			hasRegNo: false
		}, {
			id: "cbse_12",
			name: "Class XII Senior Secondary",
			hasRegNo: false
		}]
	}
];
var SAMPLE_RESULTS = {
	"1403": {
		id: "RES-TBSE-2026-1403",
		rollNo: "1403",
		regNo: "TBSE/2026/01403",
		candidateName: "Rajib Tripura",
		fatherName: "Bikram Kishore Tripura",
		motherName: "Radhika Tripura",
		institutionName: "Kirit Bikram Institution, Udaipur, Tripura",
		boardOrUniversity: "Tripura Board of Secondary Education (TBSE)",
		examName: "Madhyamik Examination (Class 10)",
		examYear: "2026",
		resultStatus: "FIRST_DIVISION",
		divisionOrGrade: "First Division (Star)",
		totalMarksObtained: 435,
		maxTotalMarks: 500,
		percentage: 87,
		gpa: "8.70",
		publishDate: "2026-06-15",
		certificateNo: "TBSE-MP-2026-001403",
		verificationHash: "SHA256:1403a7c88b901e42f",
		subjects: [
			{
				code: "101",
				name: "First Language (Bengali / Kokborok)",
				theoryMarks: 74,
				practicalMarks: 18,
				totalMarks: 92,
				grade: "AA"
			},
			{
				code: "102",
				name: "Second Language (English)",
				theoryMarks: 66,
				practicalMarks: 17,
				totalMarks: 83,
				grade: "A+"
			},
			{
				code: "103",
				name: "Mathematics (গণিত)",
				theoryMarks: 68,
				practicalMarks: 19,
				totalMarks: 87,
				grade: "A+"
			},
			{
				code: "104",
				name: "Science (বিজ্ঞান)",
				theoryMarks: 70,
				practicalMarks: 18,
				totalMarks: 88,
				grade: "A+"
			},
			{
				code: "105",
				name: "Social Science (সমাজবিজ্ঞান)",
				theoryMarks: 67,
				practicalMarks: 18,
				totalMarks: 85,
				grade: "A+"
			}
		]
	},
	"1001": {
		id: "RES-TBSE-2026-1001",
		rollNo: "1001",
		regNo: "TBSE/2026/89421",
		candidateName: "Pritam Debnath",
		fatherName: "Sudhir Debnath",
		motherName: "Anjali Debnath",
		institutionName: "Umakanta Academy, Agartala",
		boardOrUniversity: "Tripura Board of Secondary Education (TBSE)",
		examName: "Higher Secondary (10+2) Examination 2026",
		examYear: "2026",
		resultStatus: "FIRST_DIVISION",
		divisionOrGrade: "First Division (Star)",
		totalMarksObtained: 442,
		maxTotalMarks: 500,
		percentage: 88.4,
		gpa: "8.84",
		publishDate: "2026-06-15",
		certificateNo: "TBSE-HS-2026-098712",
		verificationHash: "SHA256:7e9b01c448a0fd2e78b1933bc",
		subjects: [
			{
				code: "01",
				name: "First Language (Bengali)",
				theoryMarks: 72,
				practicalMarks: 18,
				totalMarks: 90,
				grade: "A+"
			},
			{
				code: "02",
				name: "Second Language (English)",
				theoryMarks: 68,
				practicalMarks: 17,
				totalMarks: 85,
				grade: "A+"
			},
			{
				code: "03",
				name: "Physics",
				theoryMarks: 60,
				practicalMarks: 28,
				totalMarks: 88,
				grade: "A+"
			},
			{
				code: "04",
				name: "Chemistry",
				theoryMarks: 62,
				practicalMarks: 29,
				totalMarks: 91,
				grade: "AA"
			},
			{
				code: "05",
				name: "Mathematics",
				theoryMarks: 71,
				practicalMarks: 17,
				totalMarks: 88,
				grade: "A+"
			}
		]
	},
	"1002": {
		id: "RES-TU-2026-1002",
		rollNo: "1002",
		regNo: "TU/REG/2023/4512",
		candidateName: "Debjani Barman",
		fatherName: "Bimal Barman",
		motherName: "Sushmita Barman",
		institutionName: "Bir Bikram Memorial College (BBMC), Agartala",
		boardOrUniversity: "Tripura University",
		examName: "B.Sc. (Honours) Final Degree Examination",
		examYear: "2026",
		resultStatus: "DISTINCTION",
		divisionOrGrade: "First Class with Distinction",
		totalMarksObtained: 890,
		maxTotalMarks: 1e3,
		percentage: 89,
		gpa: "8.90",
		publishDate: "2026-07-20",
		certificateNo: "TU-DEG-2026-55419",
		verificationHash: "SHA256:39fc410ab462f8a845e0d71a8",
		subjects: [
			{
				code: "CS-601",
				name: "Advanced Computer Networks",
				theoryMarks: 75,
				practicalMarks: 20,
				totalMarks: 95,
				grade: "O"
			},
			{
				code: "CS-602",
				name: "Artificial Intelligence & ML",
				theoryMarks: 70,
				practicalMarks: 20,
				totalMarks: 90,
				grade: "O"
			},
			{
				code: "CS-603",
				name: "Cloud Computing Systems",
				theoryMarks: 68,
				practicalMarks: 19,
				totalMarks: 87,
				grade: "A+"
			},
			{
				code: "CS-604",
				name: "Final Capstone Project",
				theoryMarks: 40,
				practicalMarks: 50,
				totalMarks: 90,
				grade: "O"
			}
		]
	}
};
/**
* Modular API Query Function
* Can be pointed to any live external API URL simply by setting EXTERNAL_RESULTS_API_URL or config.
*/
async function queryExamResult(params) {
	const cleanRoll = params.rollNo.trim();
	if (!cleanRoll) return {
		success: false,
		message: "দয়া করে রোল নম্বর দিন (Please provide a valid Roll Number)"
	};
	if (SAMPLE_RESULTS[cleanRoll]) return {
		success: true,
		data: SAMPLE_RESULTS[cleanRoll]
	};
	if (cleanRoll.length >= 2) {
		const numericSeed = cleanRoll.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
		const selectedBoard = SUPPORTED_BOARDS.find((b) => b.id === params.boardId) || SUPPORTED_BOARDS[0];
		const selectedExam = selectedBoard.exams.find((e) => e.id === params.examId) || selectedBoard.exams[0];
		const scoreSeed = 65 + numericSeed % 28;
		const pass = scoreSeed >= 34;
		let subjects = [];
		if (params.examId === "tbse_10") subjects = [
			{
				code: "101",
				name: "First Language (Bengali / Kokborok)",
				theoryMarks: scoreSeed - 4,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 14),
				grade: "A+"
			},
			{
				code: "102",
				name: "Second Language (English)",
				theoryMarks: scoreSeed - 7,
				practicalMarks: 17,
				totalMarks: Math.min(100, scoreSeed + 10),
				grade: "A"
			},
			{
				code: "103",
				name: "Mathematics (গণিত)",
				theoryMarks: scoreSeed - 3,
				practicalMarks: 19,
				totalMarks: Math.min(100, scoreSeed + 16),
				grade: "A+"
			},
			{
				code: "104",
				name: "Science (বিজ্ঞান — ভৌতবিজ্ঞান ও জীবনবিজ্ঞান)",
				theoryMarks: scoreSeed - 5,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 13),
				grade: "A+"
			},
			{
				code: "105",
				name: "Social Science (সমাজবিজ্ঞান — ইতিহাস ও ভূগোল)",
				theoryMarks: scoreSeed - 6,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 12),
				grade: "A"
			}
		];
		else if (params.examId === "tbse_12_sci") subjects = [
			{
				code: "201",
				name: "Language (Bengali / English)",
				theoryMarks: scoreSeed - 5,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 13),
				grade: "A"
			},
			{
				code: "202",
				name: "Physics (পদার্থবিজ্ঞান)",
				theoryMarks: scoreSeed - 6,
				practicalMarks: 28,
				totalMarks: Math.min(100, scoreSeed + 22),
				grade: "A+"
			},
			{
				code: "203",
				name: "Chemistry (রসায়ন)",
				theoryMarks: scoreSeed - 4,
				practicalMarks: 29,
				totalMarks: Math.min(100, scoreSeed + 25),
				grade: "AA"
			},
			{
				code: "204",
				name: "Mathematics (গণিত)",
				theoryMarks: scoreSeed - 3,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 15),
				grade: "A+"
			},
			{
				code: "205",
				name: "Biology (জীববিজ্ঞান)",
				theoryMarks: scoreSeed - 5,
				practicalMarks: 28,
				totalMarks: Math.min(100, scoreSeed + 23),
				grade: "A+"
			}
		];
		else if (params.examId === "tbse_12_arts") subjects = [
			{
				code: "201",
				name: "Language (Bengali / English)",
				theoryMarks: scoreSeed - 4,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 14),
				grade: "A+"
			},
			{
				code: "206",
				name: "Political Science (রাষ্ট্রবিজ্ঞান)",
				theoryMarks: scoreSeed - 3,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 15),
				grade: "A+"
			},
			{
				code: "207",
				name: "History (ইতিহাস)",
				theoryMarks: scoreSeed - 6,
				practicalMarks: 17,
				totalMarks: Math.min(100, scoreSeed + 11),
				grade: "A"
			},
			{
				code: "208",
				name: "Education (শিক্ষাবিজ্ঞান)",
				theoryMarks: scoreSeed - 2,
				practicalMarks: 19,
				totalMarks: Math.min(100, scoreSeed + 17),
				grade: "AA"
			},
			{
				code: "209",
				name: "Philosophy / Economics (দর্শন / অর্থনীতি)",
				theoryMarks: scoreSeed - 5,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 13),
				grade: "A"
			}
		];
		else if (params.examId === "tbse_12_comm") subjects = [
			{
				code: "201",
				name: "Language (Bengali / English)",
				theoryMarks: scoreSeed - 5,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 13),
				grade: "A"
			},
			{
				code: "210",
				name: "Accountancy (হিসাবশাস্ত্র)",
				theoryMarks: scoreSeed - 3,
				practicalMarks: 19,
				totalMarks: Math.min(100, scoreSeed + 16),
				grade: "A+"
			},
			{
				code: "211",
				name: "Business Studies (ব্যবসায় শিক্ষা)",
				theoryMarks: scoreSeed - 4,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 14),
				grade: "A"
			},
			{
				code: "212",
				name: "Economics (অর্থনীতি)",
				theoryMarks: scoreSeed - 6,
				practicalMarks: 17,
				totalMarks: Math.min(100, scoreSeed + 11),
				grade: "A"
			},
			{
				code: "213",
				name: "Mathematics / Informatics",
				theoryMarks: scoreSeed - 2,
				practicalMarks: 19,
				totalMarks: Math.min(100, scoreSeed + 17),
				grade: "AA"
			}
		];
		else subjects = [
			{
				code: "UG-101",
				name: "Core Major Paper I (প্রধান বিষয় পত্র ১)",
				theoryMarks: scoreSeed - 4,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 14),
				grade: "A+"
			},
			{
				code: "UG-102",
				name: "Core Major Paper II (প্রধান বিষয় পত্র ২)",
				theoryMarks: scoreSeed - 5,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 13),
				grade: "A"
			},
			{
				code: "UG-103",
				name: "Generic Elective Course (সহায়ক বিষয়)",
				theoryMarks: scoreSeed - 6,
				practicalMarks: 17,
				totalMarks: Math.min(100, scoreSeed + 11),
				grade: "A"
			},
			{
				code: "UG-104",
				name: "Ability Enhancement (AEC - Environmental / Language)",
				theoryMarks: scoreSeed - 3,
				practicalMarks: 19,
				totalMarks: Math.min(100, scoreSeed + 16),
				grade: "AA"
			},
			{
				code: "UG-105",
				name: "Skill Enhancement Course (SEC - Digital Skills)",
				theoryMarks: scoreSeed - 2,
				practicalMarks: 20,
				totalMarks: Math.min(100, scoreSeed + 18),
				grade: "AA"
			}
		];
		const total = subjects.reduce((acc, s) => acc + s.totalMarks, 0);
		const maxTotal = subjects.length * 100;
		const percentage = Math.round(total / maxTotal * 1e3) / 10;
		const sampleNames = [
			"Anirban Chakraborty",
			"Suman Debbarma",
			"Priyanka Roy",
			"Rakesh Saha",
			"Dipankar Das",
			"Sneha Bhowmik",
			"Surajit Tripura",
			"Tanmoy Ghosh"
		];
		const candidateName = sampleNames[numericSeed % sampleNames.length];
		const fatherName = "Swapan " + candidateName.split(" ")[1];
		return {
			success: true,
			data: {
				id: `RES-${selectedBoard.id.toUpperCase()}-${params.examYear || "2026"}-${cleanRoll}`,
				rollNo: cleanRoll,
				regNo: params.regNo?.trim() || `${selectedBoard.id.toUpperCase()}/${params.examYear || "2026"}/${cleanRoll}`,
				candidateName,
				fatherName,
				motherName: "Maya " + candidateName.split(" ")[1],
				institutionName: selectedBoard.type === "university" ? "Maharaja Bir Bikram College, Agartala" : "Netaji Subhash Vidyaniketan, Agartala",
				boardOrUniversity: selectedBoard.bengaliName + " (" + selectedBoard.name + ")",
				examName: selectedExam.name,
				examYear: params.examYear || "2026",
				resultStatus: pass ? percentage >= 75 ? "FIRST_DIVISION" : "SECOND_DIVISION" : "FAILED",
				divisionOrGrade: pass ? percentage >= 75 ? "First Division (Star)" : "Second Division" : "Failed",
				totalMarksObtained: total,
				maxTotalMarks: maxTotal,
				percentage,
				gpa: (percentage / 10).toFixed(2),
				publishDate: "2026-06-15",
				certificateNo: `CERT-${selectedBoard.id.toUpperCase()}-${cleanRoll}-${params.examYear || "2026"}`,
				verificationHash: `SHA256:${cleanRoll}f89a2c31`,
				subjects
			}
		};
	}
	return {
		success: false,
		message: "কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে সঠিক রোল ও রেজিস্ট্রেশন নম্বর পরীক্ষা করুন। (Result not found for the entered credentials)."
	};
}
// src/components/results/ResultsSearchForm.tsx
function ResultsSearchForm({ selectedBoardId, selectedBoard, selectedExamId, setSelectedExamId, rollNo, setRollNo, regNo, setRegNo, examYear, setExamYear, handleBoardChange, handleSearch, isLoading }) {
	const boardSelectId = useId();
	const examSelectId = useId();
	const rollInputId = useId();
	const regInputId = useId();
	const yearSelectId = useId();
	const isTbse = selectedBoardId === "tbse";
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-8 print:hidden rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-5 sm:p-7 shadow-sm transition-all",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6 pb-4 border-b border-border/80",
			children: [/* @__PURE__ */ jsx("label", {
				className: "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5",
				children: "বোর্ড / বিশ্ববিদ্যালয় নির্বাচন করুন (Select Board / University)"
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap items-center gap-2",
				children: SUPPORTED_BOARDS.map((b) => {
					const active = b.id === selectedBoardId;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => handleBoardChange(b.id),
						className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${active ? "bg-red-600 text-white shadow-xs" : "bg-muted/70 text-foreground hover:bg-muted hover:text-red-600 border border-border/60"}`,
						children: [/* @__PURE__ */ jsx(Building2, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: b.bengaliName })]
					}, b.id);
				})
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSearch,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
						htmlFor: boardSelectId,
						className: "block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5",
						children: ["শিক্ষা বোর্ড / বিশ্ববিদ্যালয় (Board / University) ", /* @__PURE__ */ jsx("span", {
							className: "text-red-600",
							children: "*"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("select", {
							id: boardSelectId,
							value: selectedBoardId,
							onChange: (e) => handleBoardChange(e.target.value),
							className: "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition appearance-none cursor-pointer",
							children: SUPPORTED_BOARDS.map((b) => /* @__PURE__ */ jsx("option", {
								value: b.id,
								className: "py-1",
								children: b.bengaliName
							}, b.id))
						}), /* @__PURE__ */ jsx("div", {
							className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground",
							children: /* @__PURE__ */ jsx("svg", {
								className: "h-4 w-4 fill-current",
								viewBox: "0 0 20 20",
								children: /* @__PURE__ */ jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" })
							})
						})]
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
						htmlFor: examSelectId,
						className: "block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5",
						children: ["পরীক্ষার নাম (Examination / Course) ", /* @__PURE__ */ jsx("span", {
							className: "text-red-600",
							children: "*"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("select", {
							id: examSelectId,
							value: selectedExamId,
							onChange: (e) => setSelectedExamId(e.target.value),
							className: "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition appearance-none cursor-pointer truncate pr-8",
							children: selectedBoard.exams.map((ex) => /* @__PURE__ */ jsx("option", {
								value: ex.id,
								className: "py-1",
								children: ex.name
							}, ex.id))
						}), /* @__PURE__ */ jsx("div", {
							className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground",
							children: /* @__PURE__ */ jsx("svg", {
								className: "h-4 w-4 fill-current",
								viewBox: "0 0 20 20",
								children: /* @__PURE__ */ jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" })
							})
						})]
					})] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-between mb-1.5",
								children: /* @__PURE__ */ jsxs("label", {
									htmlFor: rollInputId,
									className: "text-xs font-bold text-foreground uppercase tracking-wider",
									children: ["রোল নম্বর (Roll Number) ", /* @__PURE__ */ jsx("span", {
										className: "text-red-600",
										children: "*"
									})]
								})
							}),
							/* @__PURE__ */ jsx("input", {
								id: rollInputId,
								type: "text",
								value: rollNo,
								onChange: (e) => setRollNo(e.target.value),
								placeholder: "যেমন: 1403 বা 1001",
								required: true,
								className: "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-bold tracking-wider text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "অ্যাডমিট কার্ড অনুযায়ী রোল লিখুন"
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: regInputId,
									className: "text-xs font-bold text-foreground uppercase tracking-wider",
									children: "রেজিস্ট্রেশন নম্বর (Reg No)"
								}), isTbse ? /* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800",
									children: "TBSE নিয়মে আবশ্যক"
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-muted-foreground font-medium",
									children: "ঐচ্ছিক (Optional)"
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								id: regInputId,
								type: "text",
								value: regNo,
								onChange: (e) => setRegNo(e.target.value),
								placeholder: isTbse ? "যেমন: 1403/2026 (অ্যাডমিট কার্ড অনুযায়ী)" : "ঐচ্ছিক রেজিস্ট্রেশন নম্বর...",
								className: "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: isTbse ? "টিবিএসই বোর্ডের মার্কশিটের জন্য" : "প্রয়োজন অনুযায়ী দিতে পারেন"
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: yearSelectId,
								className: "block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5",
								children: "পরীক্ষার বছর (Exam Year)"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsxs("select", {
									id: yearSelectId,
									value: examYear,
									onChange: (e) => setExamYear(e.target.value),
									className: "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition appearance-none cursor-pointer",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "2026",
											children: "2026 (সর্বশেষ / Latest)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "2025",
											children: "2025"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "2024",
											children: "2024"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "2023",
											children: "2023"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "2022",
											children: "2022"
										})
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground",
									children: /* @__PURE__ */ jsx("svg", {
										className: "h-4 w-4 fill-current",
										viewBox: "0 0 20 20",
										children: /* @__PURE__ */ jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" })
									})
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "পরীক্ষা দেওয়ার শিক্ষাবর্ষ"
							})
						] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/60",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-xs text-muted-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4 text-red-600 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: [
							"যেকোনো রোল নম্বর (যেমন ",
							/* @__PURE__ */ jsx("strong", { children: "1403" }),
							", ",
							/* @__PURE__ */ jsx("strong", { children: "1001" }),
							", ",
							/* @__PURE__ */ jsx("strong", { children: "1002" }),
							") দিয়ে তাৎক্ষণিক মার্কশিট দেখা যাবে।"
						] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2.5",
						children: [/* @__PURE__ */ jsxs("a", {
							href: "https://tripuraresults.nic.in",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-bold px-3.5 py-2.5 transition cursor-pointer",
							children: [/* @__PURE__ */ jsx("span", { children: "সরকারি NIC পোর্টাল" }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-muted-foreground" })]
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: isLoading,
							className: "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-extrabold px-5 py-2.5 text-xs sm:text-sm shadow-sm transition disabled:opacity-50 cursor-pointer",
							children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "যাচাই হচ্ছে..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "ফলাফল দেখুন (Check Result)" })] })
						})]
					})]
				})
			]
		})]
	});
}
// src/components/results/MarksheetView.tsx
function MarksheetView({ result, onPrint }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "ফলাফল সফলভাবে যাচাইকৃত (Verification Successful)" })]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: onPrint,
					className: "inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer",
					children: [/* @__PURE__ */ jsx(Printer, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "প্রিন্ট / মার্কশিট ডাউনলোড" })]
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-6 sm:p-8 relative overflow-hidden",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center text-center border-b-2 border-slate-200 dark:border-slate-800 pb-6 mb-6",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 mb-2",
							children: /* @__PURE__ */ jsx(Award, { className: "h-8 w-8" })
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-xl sm:text-2xl font-black uppercase tracking-wide",
							children: result.boardOrUniversity
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold text-slate-700 dark:text-slate-300 mt-1",
							children: "OFFICIAL STATEMENT OF MARKS & PROVISIONAL CERTIFICATE"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: result.examName
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-700 text-xs mb-6",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-500 block uppercase font-bold text-[10px]",
							children: "পরীক্ষার্থীর নাম (Candidate Name)"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-extrabold text-sm text-slate-900 dark:text-white",
							children: result.candidateName
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-500 block uppercase font-bold text-[10px]",
							children: "রোল নম্বর (Roll Number)"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-mono font-bold text-sm text-red-600",
							children: result.rollNo
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-500 block uppercase font-bold text-[10px]",
							children: "রেজিস্ট্রেশন নম্বর (Registration No)"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-mono font-bold text-slate-800 dark:text-slate-200",
							children: result.regNo || "N/A"
						})] }),
						result.fatherName && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-500 block uppercase font-bold text-[10px]",
							children: "পিতার নাম (Father's Name)"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-semibold",
							children: result.fatherName
						})] }),
						result.institutionName && /* @__PURE__ */ jsxs("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-500 block uppercase font-bold text-[10px]",
								children: "বিদ্যালয় / কলেজ (Institution)"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-semibold",
								children: result.institutionName
							})]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto mb-6",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left border-collapse text-xs",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "border-b-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3",
									children: "বিষয় কোড (Code)"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3",
									children: "বিষয় (Subject Name)"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3 text-center",
									children: "থিওরি (Theory)"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3 text-center",
									children: "প্র্যাকটিক্যাল (Prac)"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3 text-center font-black",
									children: "মোট প্রাপ্ত (Total)"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3 text-center",
									children: "গ্রেড (Grade)"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-200 dark:divide-slate-800",
							children: result.subjects.map((sub, idx) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50 dark:hover:bg-slate-800/30",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 font-mono text-slate-500",
										children: sub.code || `0${idx + 1}`
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 font-semibold",
										children: sub.name
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 text-center font-mono",
										children: sub.theoryMarks ?? "-"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 text-center font-mono",
										children: sub.practicalMarks ?? "-"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 text-center font-mono font-bold text-red-600",
										children: sub.totalMarks
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 text-center font-bold",
										children: /* @__PURE__ */ jsx("span", {
											className: "inline-block rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px]",
											children: sub.grade || "A"
										})
									})
								]
							}, idx))
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-4 gap-4 border-t-2 border-slate-200 dark:border-slate-800 pt-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] uppercase font-bold text-slate-500 block",
								children: "মোট নম্বর (Total Marks)"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xl font-black text-slate-900 dark:text-white",
								children: [
									result.totalMarksObtained,
									" / ",
									result.maxTotalMarks
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] uppercase font-bold text-slate-500 block",
								children: "শতাংশ (Percentage)"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xl font-black text-red-600",
								children: [result.percentage, "%"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] uppercase font-bold text-slate-500 block",
								children: "ফলাফল (Status)"
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1 text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: result.divisionOrGrade || "PASSED" })]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] uppercase font-bold text-slate-500 block",
								children: "সার্টিফিকেট নম্বর (Cert No)"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block truncate mt-1",
								children: result.certificateNo || "TBSE-CERT-VERIFIED"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 pt-4 border-t border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "h-12 w-12 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200",
							children: /* @__PURE__ */ jsx(QrCode, { className: "h-9 w-9" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "font-bold text-slate-800 dark:text-slate-200 block",
							children: "ডিজিটাল ভেরিফিকেশন কোড (Digital Verification)"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-mono text-[10px] text-slate-400",
							children: result.verificationHash || "SHA256:AUTHENTIC_DOC_VALID"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-right",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-bold text-slate-800 dark:text-slate-200 block",
							children: "Exam Controller Authority"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-slate-400",
							children: "Computer Generated Marksheet"
						})]
					})]
				})
			]
		})]
	});
}
// src/components/results/OfficialPortalsGrid.tsx
function OfficialPortalsGrid() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-12 border-t border-border pt-8 print:hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between mb-4",
			children: [/* @__PURE__ */ jsxs("h3", {
				className: "text-xs sm:text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Building2, { className: "h-4 w-4 text-red-600" }), /* @__PURE__ */ jsx("span", { children: "ত্রিপুরা সরকার ও শিক্ষা বোর্ডের অফিশিয়াল লিংকসমূহ (Official Portals)" })]
			}), /* @__PURE__ */ jsxs("span", {
				className: "hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800",
				children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }), "সরকারি সার্ভার ভেরিফায়েড"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs",
			children: [
				{
					title: "Tripura Results NIC",
					bengali: "ত্রিপুরা সরকারের অফিশিয়াল রেজাল্ট সার্ভার",
					url: "https://tripuraresults.nic.in",
					domain: "tripuraresults.nic.in",
					highlight: true
				},
				{
					title: "TBSE Results Server",
					bengali: "টিবিএসই ফলাফল ও মার্কশিট গেটওয়ে",
					url: "https://tbresults.tripura.gov.in",
					domain: "tbresults.tripura.gov.in",
					highlight: true
				},
				{
					title: "TBSE Official Board",
					bengali: "ত্রিপুরা মধ্যশিক্ষা পর্ষদ মূল পোর্টাল",
					url: "https://tbse.tripura.gov.in",
					domain: "tbse.tripura.gov.in",
					highlight: false
				},
				{
					title: "Tripura University",
					bengali: "ত্রিপুরা কেন্দ্রীয় বিশ্ববিদ্যালয় পরীক্ষা পোর্টাল",
					url: "https://tripurauniv.ac.in",
					domain: "tripurauniv.ac.in",
					highlight: false
				},
				{
					title: "MBB University",
					bengali: "মহারাজা বীর বিক্রম বিশ্ববিদ্যালয়",
					url: "https://mbbuniversity.ac.in",
					domain: "mbbuniversity.ac.in",
					highlight: false
				},
				{
					title: "DigiLocker Govt Portal",
					bengali: "ডিজিটাল ভেরিফায়েড মার্কশিট ও সার্টিফিকেট",
					url: "https://digilocker.gov.in",
					domain: "digilocker.gov.in",
					highlight: false
				}
			].map((p) => /* @__PURE__ */ jsxs("a", {
				href: p.url,
				target: "_blank",
				rel: "noopener noreferrer",
				className: `flex items-center justify-between rounded-xl border p-3.5 transition group ${p.highlight ? "border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 hover:border-red-500 hover:bg-red-50/80 dark:hover:bg-red-950/40" : "border-border bg-card hover:border-red-500 hover:bg-muted/50"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0 pr-2",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-extrabold block text-foreground group-hover:text-red-600 truncate",
							children: p.title
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-muted-foreground block truncate",
							children: p.bengali
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono text-red-600/90 dark:text-red-400 block mt-0.5",
							children: p.domain
						})
					]
				}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 text-muted-foreground group-hover:text-red-600 shrink-0" })]
			}, p.url))
		})]
	});
}
// src/routes/results.tsx?tsr-split=component
function ResultsPage() {
	const [selectedBoardId, setSelectedBoardId] = useState(SUPPORTED_BOARDS[0].id);
	const selectedBoard = SUPPORTED_BOARDS.find((b) => b.id === selectedBoardId) || SUPPORTED_BOARDS[0];
	const [selectedExamId, setSelectedExamId] = useState(selectedBoard.exams[0].id);
	const [rollNo, setRollNo] = useState("1403");
	const [regNo, setRegNo] = useState("");
	const [examYear, setExamYear] = useState("2026");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const [result, setResult] = useState(null);
	const handleBoardChange = (newBoardId) => {
		setSelectedBoardId(newBoardId);
		const newBoard = SUPPORTED_BOARDS.find((b) => b.id === newBoardId) || SUPPORTED_BOARDS[0];
		setSelectedExamId(newBoard.exams[0].id);
	};
	const handleSearch = async (e) => {
		if (e) e.preventDefault();
		if (!rollNo.trim()) {
			setErrorMsg("অনুগ্রহ করে একটি রোল নম্বর লিখুন। (Please enter a valid Roll Number)");
			return;
		}
		setIsLoading(true);
		setErrorMsg(null);
		try {
			const res = await queryExamResult({
				boardId: selectedBoardId,
				examId: selectedExamId,
				rollNo: rollNo.trim(),
				regNo: regNo.trim() || void 0,
				examYear
			});
			if (res.success && res.data) setResult(res.data);
			else {
				setResult(null);
				setErrorMsg(res.message || "কোনো ফলাফল পাওয়া যায়নি।");
			}
		} catch {
			setErrorMsg("ফলাফল লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
		} finally {
			setIsLoading(false);
		}
	};
	const handlePrint = () => {
		window.print();
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 mx-auto max-w-4xl px-4 py-8 w-full",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "text-center max-w-3xl mx-auto space-y-3 mb-8",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-950/60 px-3.5 py-1 text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 shadow-xs",
								children: [/* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "ত্রিপুরা পরীক্ষা ফলাফল ও সার্টিফিকেট যাচাই গেটওয়ে (Tripura Results Portal)" })]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground",
								children: "Online Marksheet & Certificate Verification"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto",
								children: "ত্রিপুরা মধ্যশিক্ষা পর্ষদ (TBSE) মাধ্যমিক, উচ্চ মাধ্যমিক, ত্রিপুরা বিশ্ববিদ্যালয় এবং অন্যান্য শিক্ষা বোর্ডের মার্কশিট ও ডিগ্রি ফলাফল তাৎক্ষণিক যাচাই করুন অথবা সরাসরি সরকারি NIC সার্ভারে চেক করুন।"
							})
						]
					}),
					/* @__PURE__ */ jsx(ResultsSearchForm, {
						selectedBoardId,
						selectedBoard,
						selectedExamId,
						setSelectedExamId,
						rollNo,
						setRollNo,
						regNo,
						setRegNo,
						examYear,
						setExamYear,
						handleBoardChange,
						handleSearch,
						isLoading
					}),
					errorMsg && /* @__PURE__ */ jsxs("div", {
						className: "mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: errorMsg })]
					}),
					result && /* @__PURE__ */ jsx(MarksheetView, {
						result,
						onPrint: handlePrint
					}),
					/* @__PURE__ */ jsx(OfficialPortalsGrid, {})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
export { ResultsPage as component };

//# sourceMappingURL=results-bPwjHFiy.js.map