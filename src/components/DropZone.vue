<template>
    <div class="border rounded-lg p-4" @drop.prevent="addFile" @dragover.prevent>

        <h2 class="text-lg mb-4 font-semibold">Files to Upload (Drag them over)</h2>

        <ul class="mb-4 divide-y border-t border-b border-amber-400 bg-amber-50 -mx-4">
            <li v-for="file in files" class="p-3">
                {{ file.name }} <span class="text-amber-700 text-xs">({{ Math.floor(file.size/1024) }} kb)</span>
                <button class="px-3 py-1 mx-2 text-sm bg-red-300 hover:bg-red-400 rounded-md float-right" @click="removeFile(file)" title="Remove">&#10005;</button>
            </li>
        </ul>

        <button class="py-2 px-4 bg-blue-200 hover:bg-blue-300 rounded-md" :disabled="uploadDisabled" @click="upload">Upload</button>

    </div>
</template>

<script>
export default {
    data() {
        return {
            files: []
        }
    },
    computed: {
        uploadDisabled() {
            return this.files.length === 0;
        }
    },
    methods: {
        addFile(e) {
            let droppedFiles = e.dataTransfer.files;
            if(!droppedFiles) return;

            // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
            ([...droppedFiles]).forEach(f => {
                this.files.push(f);
            });
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
                console.log(result);
            }, false);

            this.files.forEach((file,x) => {
                // console.log(file)
                // console.log(x)

                // formData.append('file'+(x+1), f);

                // Read in the image file as a data URL.
                reader.readAsText(file);
            });

            // fetch('https://httpbin.org/post', {
            //     method:'POST',
            //     body: formData
            // })
            // .then(res => res.json())
            // .then(res => {
            //     console.log('done uploading', res);
            // })
            // .catch(e => {
            //     console.error(JSON.stringify(e.message));
            // });

        }
    }
}
</script>
