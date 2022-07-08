<template>
    <div class="border rounded-lg p-4" @drop.prevent="addFile" @dragover.prevent>

        <h2 class="text-lg mb-4 font-semibold">Files to Upload</h2>

        <ul class="mb-4 divide-y border-t border-b border-amber-400 bg-amber-50 -mx-4">
            <li v-for="file in files" class="p-3">
                {{ file.name }} <span class="text-amber-700 text-xs">({{ Math.floor(file.size/1024) }} kb)</span>
<!--                <button class="px-3 py-1 mx-2 text-sm bg-red-300 hover:bg-red-400 rounded-md float-right" @click="removeFile(file)" title="Remove">&#10005;</button>-->
            </li>
            <li v-if="files.length === 0" class="p-3 italic">
                (Drag them over here)
            </li>
        </ul>

        <button class="py-2 px-4 mr-2 bg-blue-300 hover:bg-blue-400 rounded-md cursor-pointer" :disabled="uploadDisabled" @click="upload">Start Upload</button>
        <button v-if="!downloadDisabled" class="py-2 px-4 mr-2 bg-green-300 hover:bg-green-400 rounded-md cursor-pointer" @click="download">Download Excel</button>
        <button v-if="!downloadDisabled" class="py-2 px-4 mr-2 bg-green-300 hover:bg-green-400 rounded-md cursor-pointer" @click="downloadDefects">Download Defects Excel</button>
        <button v-if="!downloadDisabled" class="py-2 px-4 mr-2 bg-green-300 hover:bg-green-400 rounded-md cursor-pointer" @click="downloadStructures">Download Structures Excel</button>

    </div>

    <div class="border rounded-lg p-4">
        <h2 class="text-lg mb-4 font-semibold">Uploaded</h2>

        <ul class="mb-4 divide-y border-t border-b border-green-400 bg-green-50 -mx-4" v-if="isUploading()">
            <li class="p-3">Processing: <span class="text-sm">{{ processingStatus() }}</span></li>
        </ul>

        <ul class="list-decimal px-8">
            <li v-for="file in processedFiles()">{{ file }}</li>
        </ul>
    </div>
</template>

<script>
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { COLUMN_NAMES, DEFECT_COLUMNS, STRUCTURE_COLUMNS } from '../constants/columns'

export default {
    data() {
        return {
            files: [],
            persons: [],
            incoming: [],
            status: "",
        }
    },
    computed: {
        uploadDisabled() {
            return this.files.length === 0;
        },
        downloadDisabled() {
            return Object.keys(this.$store.state.dropzone.data).length === 0;
        },
    },
    methods: {
        processedFiles() {
            return this.$store.getters.getProcessedFiles
        },
        isUploading() {
            return this.$store.getters.isUploading
        },
        processingStatus() {
            return this.$store.getters.getIncomingFile
        },
        addFile(e) {
            let droppedFiles = e.dataTransfer.files;
            if(!droppedFiles) return;

            // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
            ([...droppedFiles]).forEach(f => {
                this.files.push(f);
            });

            // this.upload()
        },
        removeFile(file){
            this.files = this.files.filter(f => {
                return f != file;
            });
        },
        upload() {
            let reader = new FileReader();
            // let formData = new FormData();

            reader.addEventListener("load", () => {
                // this will then display a text file
                let result = reader.result
                result = result.replace(/ObjectId\((.*)\)/g, "$1")
                result = result.replace(/ISODate\((.*)\)/g, "$1")

                result = JSON.parse(result)

                let resultArr = []

                // process multiple submissions per JSON file
                if (Array.isArray(result)) {
                    resultArr = result
                } else {
                    resultArr.push(result)
                }

                // process array and send to reducer
                resultArr.forEach(result => {
                    this.$store.dispatch('PROCESS_FILE', result)
                })

            }, false);

            reader.addEventListener("loadend", () => {
                console.log("finished reading file, trying next one...")
                this.$store.commit('FILE_LOADED')
                this.upload()
            }, false)

            // upload first file in queue
            let queuedFile = this.files.shift()

            // safely return if no more files
            if (!queuedFile) {
                this.$store.commit('FINISHED')
                return true
            }

            this.$store.commit('FILE_PROCESSING', queuedFile.name)

            // Read in the image file as a data URL.
            reader.readAsText(queuedFile);
        },
        download: async function() {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('My Sheet');

            worksheet.columns = COLUMN_NAMES

            // add styles
            worksheet.getRow(1).alignment = { wrapText: true }

            let sites = this.$store.getters.getValidSubmissions

            let details = this.$store.getters.getSiteDetails
            let generators = this.$store.getters.getGenerators
            let batteries = this.$store.getters.getBatteries
            let rectifiers = this.$store.getters.getRectifiers
            let acu = this.$store.getters.getAcus

            sites.forEach(site => {
                worksheet.addRow({
                    id: site,
                    ...details[site],
                    ...generators[site],
                    ...batteries[site],
                    ...acu[site],
                    ...rectifiers[site],
                    // amount_shelters:
                    amount_rectifiers: this.$store.getters.countRectifiers(site),
                    amount_batteries: this.$store.getters.countBatteries(site),
                    amount_acu: this.$store.getters.countAcus(site),
                    amount_generators: this.$store.getters.countGenerators(site),
                })
            })

            // file writing
            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                saveAs(blob, 'surveys.xlsx');
            });
        },
        downloadDefects: async function() {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('My Sheet');

            worksheet.columns = DEFECT_COLUMNS

            // add styles
            worksheet.getRow(1).alignment = { wrapText: true }

            let emeraldBackground = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'96c8a2'},
            }

            let headingFont = {
                size: 12,
            }

            worksheet.getCell('A1').fill = emeraldBackground
            worksheet.getCell('A1').font = headingFont

            worksheet.getCell('B1').fill = emeraldBackground
            worksheet.getCell('B1').font = headingFont

            worksheet.getCell('C1').fill = emeraldBackground
            worksheet.getCell('C1').font = headingFont

            worksheet.getCell('D1').fill = emeraldBackground
            worksheet.getCell('D1').font = headingFont

            worksheet.getCell('E1').fill = emeraldBackground
            worksheet.getCell('E1').font = headingFont

            worksheet.getCell('F1').fill = emeraldBackground
            worksheet.getCell('F1').font = headingFont

            worksheet.getCell('G1').fill = emeraldBackground
            worksheet.getCell('G1').font = headingFont

            let defects = this.$store.getters.getDefectsArrays
            let otherDefects = this.$store.getters.getSurveyDetailDefects
            defects = defects.concat(otherDefects)

            this.$store.getters.getDefectsArrays.forEach(defect => {
                worksheet.addRow(defect);
            })

            // file writing
            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                saveAs(blob, 'defects.xlsx');
            });
        },
        downloadStructures: async function() {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('My Sheet');

            worksheet.columns = STRUCTURE_COLUMNS

            // add styles
            worksheet.getRow(1).alignment = { wrapText: true }

            let emeraldBackground = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'96c8a2'},
            }

            let headingFont = {
                size: 12,
            }

            worksheet.getCell('A1').fill = emeraldBackground
            worksheet.getCell('A1').font = headingFont

            worksheet.getCell('B1').fill = emeraldBackground
            worksheet.getCell('B1').font = headingFont

            worksheet.getCell('C1').fill = emeraldBackground
            worksheet.getCell('C1').font = headingFont

            worksheet.getCell('D1').fill = emeraldBackground
            worksheet.getCell('D1').font = headingFont

            worksheet.getCell('E1').fill = emeraldBackground
            worksheet.getCell('E1').font = headingFont

            worksheet.getCell('F1').fill = emeraldBackground
            worksheet.getCell('F1').font = headingFont

            worksheet.getCell('G1').fill = emeraldBackground
            worksheet.getCell('G1').font = headingFont

            worksheet.getCell('H1').fill = emeraldBackground
            worksheet.getCell('H1').font = headingFont

            worksheet.getCell('I1').fill = emeraldBackground
            worksheet.getCell('I1').font = headingFont

            this.$store.getters.getEquipmentArrays.forEach(defect => {
                worksheet.addRow(defect);
            })

            // file writing
            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                saveAs(blob, 'structures.xlsx');
            });
        }
    }
}
</script>
