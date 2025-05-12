export default function slugifyText(text){
    return text.toLowerCase()
            .trim()
            .replace(/\s+/g,"-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-")
}