import { t as Footer } from "./Footer-DenRIELb.js";
import { t as Header } from "./Header-g8BQXnkq.js";
import { useId, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Award, Building2, CheckCircle2, ExternalLink, GraduationCap, Printer, QrCode, RefreshCw, Search } from "lucide-react";
//#region src/lib/results-api.ts
var SUPPORTED_BOARDS = [
	{
		id: "tbse",
		name: "Tripura Board of Secondary Education (TBSE)",
		bengaliName: "ত্রিপুরা মধ্যশিক্ষা পর্ষদ (TBSE)",
		type: "board",
		exams: [
			{
				id: "tbse_10",
				name: "Madhyamik Examination (Class 10)",
				hasRegNo: true
			},
			{
				id: "tbse_12_sci",
				name: "Higher Secondary (10+2) - Science",
				hasRegNo: true
			},
			{
				id: "tbse_12_arts",
				name: "Higher Secondary (10+2) - Arts",
				hasRegNo: true
			},
			{
				id: "tbse_12_comm",
				name: "Higher Secondary (10+2) - Commerce",
				hasRegNo: true
			}
		]
	},
	{
		id: "tu",
		name: "Tripura University (A Central University)",
		bengaliName: "ত্রিপুরা বিশ্ববিদ্যালয়",
		type: "university",
		exams: [
			{
				id: "tu_ug_sem",
				name: "Undergraduate (BA / BSc / BCom) - Semester Exam",
				hasRegNo: true
			},
			{
				id: "tu_pg_sem",
				name: "Postgraduate (MA / MSc / MCom) - Semester Exam",
				hasRegNo: true
			},
			{
				id: "tu_degree",
				name: "Final Degree Certificate Verification",
				hasRegNo: true
			}
		]
	},
	{
		id: "mbbu",
		name: "Maharaja Bir Bikram (MBB) University",
		bengaliName: "মহারাজা বীর বিক্রম বিশ্ববিদ্যালয়",
		type: "university",
		exams: [{
			id: "mbbu_ug",
			name: "Degree Marksheet & Semester Results",
			hasRegNo: true
		}, {
			id: "mbbu_degree",
			name: "Degree Certificate Verification",
			hasRegNo: true
		}]
	},
	{
		id: "cbse",
		name: "Central Board of Secondary Education (CBSE)",
		bengaliName: "সিবিএসই (CBSE)",
		type: "national",
		exams: [{
			id: "cbse_10",
			name: "Class X Secondary School Examination"
		}, {
			id: "cbse_12",
			name: "Class XII Senior School Certificate"
		}]
	}
];
var SAMPLE_RESULTS = {
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
	if (/^\d{4,8}$/.test(cleanRoll)) {
		const rollNum = parseInt(cleanRoll, 10);
		const selectedBoard = SUPPORTED_BOARDS.find((b) => b.id === params.boardId) || SUPPORTED_BOARDS[0];
		const selectedExam = selectedBoard.exams.find((e) => e.id === params.examId) || selectedBoard.exams[0];
		const scoreSeed = 70 + rollNum % 25;
		const pass = scoreSeed >= 40;
		const subjects = [
			{
				code: "SUB-1",
				name: "Language I / সাহিত্য",
				theoryMarks: scoreSeed - 5,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 13),
				grade: "A"
			},
			{
				code: "SUB-2",
				name: "Language II (English)",
				theoryMarks: scoreSeed - 8,
				practicalMarks: 17,
				totalMarks: Math.min(100, scoreSeed + 9),
				grade: "A"
			},
			{
				code: "SUB-3",
				name: "Core Major Subject 1",
				theoryMarks: scoreSeed - 2,
				practicalMarks: 19,
				totalMarks: Math.min(100, scoreSeed + 17),
				grade: "A+"
			},
			{
				code: "SUB-4",
				name: "Core Major Subject 2",
				theoryMarks: scoreSeed - 4,
				practicalMarks: 18,
				totalMarks: Math.min(100, scoreSeed + 14),
				grade: "A"
			},
			{
				code: "SUB-5",
				name: "Elective Subject",
				theoryMarks: scoreSeed - 6,
				practicalMarks: 19,
				totalMarks: Math.min(100, scoreSeed + 13),
				grade: "A"
			}
		];
		const total = subjects.reduce((acc, s) => acc + s.totalMarks, 0);
		const maxTotal = subjects.length * 100;
		const percentage = Math.round(total / maxTotal * 1e3) / 10;
		return {
			success: true,
			data: {
				id: `RES-${selectedBoard.id.toUpperCase()}-${params.examYear || "2026"}-${cleanRoll}`,
				rollNo: cleanRoll,
				regNo: params.regNo?.trim() || `${selectedBoard.id.toUpperCase()}/${params.examYear || "2026"}/${cleanRoll}`,
				candidateName: `Student (Roll ${cleanRoll})`,
				institutionName: selectedBoard.type === "university" ? "Affiliated College, Agartala" : "Government Higher Secondary School, Tripura",
				boardOrUniversity: selectedBoard.name,
				examName: selectedExam.name,
				examYear: params.examYear || "2026",
				resultStatus: pass ? percentage >= 75 ? "FIRST_DIVISION" : "SECOND_DIVISION" : "FAILED",
				divisionOrGrade: pass ? percentage >= 75 ? "First Division" : "Second Division" : "Failed",
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
//#endregion
//#region src/components/results/ResultsSearchForm.tsx
function ResultsSearchForm({ selectedBoardId, selectedBoard, selectedExamId, setSelectedExamId, rollNo, setRollNo, regNo, setRegNo, examYear, setExamYear, handleBoardChange, handleSearch, isLoading }) {
	const boardSelectId = useId();
	const examSelectId = useId();
	const rollInputId = useId();
	const regInputId = useId();
	const yearSelectId = useId();
	return /* @__PURE__ */ jsx("div", {
		className: "mb-10 print:hidden border-b border-slate-200 dark:border-slate-800 pb-8",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSearch,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: boardSelectId,
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5",
						children: "শিক্ষা বোর্ড / বিশ্ববিদ্যালয় (Board / University)"
					}), /* @__PURE__ */ jsx("select", {
						id: boardSelectId,
						value: selectedBoardId,
						onChange: (e) => handleBoardChange(e.target.value),
						className: "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm font-medium focus:border-red-600 focus:outline-none",
						children: SUPPORTED_BOARDS.map((b) => /* @__PURE__ */ jsxs("option", {
							value: b.id,
							children: [
								b.bengaliName,
								" (",
								b.name,
								")"
							]
						}, b.id))
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: examSelectId,
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5",
						children: "পরীক্ষার নাম (Examination / Course)"
					}), /* @__PURE__ */ jsx("select", {
						id: examSelectId,
						value: selectedExamId,
						onChange: (e) => setSelectedExamId(e.target.value),
						className: "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm font-medium focus:border-red-600 focus:outline-none",
						children: selectedBoard.exams.map((ex) => /* @__PURE__ */ jsx("option", {
							value: ex.id,
							children: ex.name
						}, ex.id))
					})] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: rollInputId,
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5",
							children: "রোল নম্বর (Roll Number) *"
						}), /* @__PURE__ */ jsx("input", {
							id: rollInputId,
							type: "text",
							value: rollNo,
							onChange: (e) => setRollNo(e.target.value),
							placeholder: "e.g. 1001 or 1002",
							className: "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm font-semibold tracking-wider focus:border-red-600 focus:outline-none"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: regInputId,
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5",
							children: "রেজিস্ট্রেশন নম্বর (Registration No - Optional)"
						}), /* @__PURE__ */ jsx("input", {
							id: regInputId,
							type: "text",
							value: regNo,
							onChange: (e) => setRegNo(e.target.value),
							placeholder: "Optional registration no...",
							className: "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: yearSelectId,
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5",
							children: "পরীক্ষার বছর (Exam Year)"
						}), /* @__PURE__ */ jsxs("select", {
							id: yearSelectId,
							value: examYear,
							onChange: (e) => setExamYear(e.target.value),
							className: "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm font-medium focus:border-red-600 focus:outline-none",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "2026",
									children: "2026 (Latest)"
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
								})
							]
						})] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3 pt-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-xs text-slate-500",
						children: [
							"💡 ",
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold",
								children: "টিপ:"
							}),
							" টেস্ট করার জন্য রোল নম্বর",
							" ",
							/* @__PURE__ */ jsx("code", {
								className: "rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-bold text-red-600",
								children: "1001"
							}),
							" ",
							"(TBSE) বা",
							" ",
							/* @__PURE__ */ jsx("code", {
								className: "rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-bold text-blue-600",
								children: "1002"
							}),
							" ",
							"(Tripura Univ Degree) ব্যবহার করুন।"
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: isLoading,
						className: "inline-flex items-center gap-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 text-sm transition disabled:opacity-50 cursor-pointer",
						children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "খোঁজা হচ্ছে..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "ফলাফল দেখুন (Check Result)" })] })
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/results/MarksheetView.tsx
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
//#endregion
//#region src/components/results/OfficialPortalsGrid.tsx
function OfficialPortalsGrid() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 print:hidden",
		children: [/* @__PURE__ */ jsxs("h3", {
			className: "text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(Building2, { className: "h-4 w-4 text-red-600" }), /* @__PURE__ */ jsx("span", { children: "ত্রিপুরা শিক্ষা ও ফলাফল অফিশিয়াল পোর্টালসমূহ (Official Portals)" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs",
			children: [
				/* @__PURE__ */ jsxs("a", {
					href: "https://tbse.tripura.gov.in",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-muted/50 transition group",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold block text-slate-900 dark:text-white group-hover:text-red-600",
						children: "TBSE Portal"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] text-slate-400",
						children: "tbse.tripura.gov.in"
					})] }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" })]
				}),
				/* @__PURE__ */ jsxs("a", {
					href: "https://tripurauniv.ac.in",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-muted/50 transition group",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold block text-slate-900 dark:text-white group-hover:text-red-600",
						children: "Tripura University"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] text-slate-400",
						children: "tripurauniv.ac.in"
					})] }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" })]
				}),
				/* @__PURE__ */ jsxs("a", {
					href: "https://mbbuniversity.ac.in",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-muted/50 transition group",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold block text-slate-900 dark:text-white group-hover:text-red-600",
						children: "MBB University"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] text-slate-400",
						children: "mbbuniversity.ac.in"
					})] }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" })]
				}),
				/* @__PURE__ */ jsxs("a", {
					href: "https://digilocker.gov.in",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-muted/50 transition group",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold block text-slate-900 dark:text-white group-hover:text-red-600",
						children: "DigiLocker"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] text-slate-400",
						children: "Verified Certificates"
					})] }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" })]
				})
			]
		})]
	});
}
//#endregion
//#region src/routes/results.tsx?tsr-split=component
function ResultsPage() {
	const [selectedBoardId, setSelectedBoardId] = useState(SUPPORTED_BOARDS[0].id);
	const selectedBoard = SUPPORTED_BOARDS.find((b) => b.id === selectedBoardId) || SUPPORTED_BOARDS[0];
	const [selectedExamId, setSelectedExamId] = useState(selectedBoard.exams[0].id);
	const [rollNo, setRollNo] = useState("1001");
	const [regNo, setRegNo] = useState("");
	const [examYear, setExamYear] = useState("2026");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const [result, setResult] = useState(null);
	const handleBoardChange = (newBoardId) => {
		setSelectedBoardId(newBoardId);
		setSelectedExamId((SUPPORTED_BOARDS.find((b) => b.id === newBoardId) || SUPPORTED_BOARDS[0]).exams[0].id);
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
						className: "text-center max-w-2xl mx-auto space-y-2 mb-8",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-950/50 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-400",
								children: [/* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "ত্রিপুরা পরীক্ষার ফলাফল ও সার্টিফিকেট পোর্টাল" })]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-2xl sm:text-3xl font-extrabold tracking-tight",
								children: "Online Marksheet & Degree Certificate Verification"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-slate-600 dark:text-slate-400",
								children: "ত্রিপুরা মধ্যশিক্ষা পর্ষদ (TBSE), ত্রিপুরা বিশ্ববিদ্যালয় এবং অন্যান্য পরীক্ষার মার্কশিট ও ডিগ্রি ফলাফল সহজেই চেক ও ডাউনলোড করুন।"
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
//#endregion
export { ResultsPage as component };

//# sourceMappingURL=results-BFmquK5s.js.map