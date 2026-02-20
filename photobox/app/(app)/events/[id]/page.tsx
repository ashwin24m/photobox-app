"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Image from "next/image";
import QRCode from "react-qr-code";

const supabase = getSupabase();



/* TYPES */

type Event = {
id:string;
name:string;
host_name:string;
event_code:string;
gallery_enabled?:boolean;
};

type Media = {
id:string;
file_url:string;
status:string;
archived:boolean;
uploader_name:string;
uploader_phone:string;
bytes:number|null;
};



export default function EventControlPage(){

const { id } = useParams();

const [event,setEvent]=useState<Event|null>(null);
const [media,setMedia]=useState<Media[]>([]);
const [loading,setLoading]=useState(true);
const [openFolders,setOpenFolders]=useState<any>({});
const [qr,setQr]=useState<string|null>(null);
const [qrTitle,setQrTitle]=useState("");



useEffect(()=>{ load(); },[]);



async function load(){

setLoading(true);

const { data:eventData }=
await supabase
.from("events")
.select("*")
.eq("id",id)
.single();

setEvent(eventData);

if(eventData){

const { data:mediaData }=
await supabase
.from("media")
.select("*")
.eq("event_code",eventData.event_code)
.order("created_at",{ascending:false});

setMedia(mediaData||[]);

}

setLoading(false);

}



/* UPDATE */

async function updateArchive(item:Media){

const newValue=!item.archived;

setMedia(prev=>
prev.map(m=>
m.id===item.id?{...m,archived:newValue}:m
));

await supabase
.from("media")
.update({archived:newValue})
.eq("id",item.id);

}



async function updateApprove(item:Media){

const newValue=
item.status==="approved"?"pending":"approved";

setMedia(prev=>
prev.map(m=>
m.id===item.id?{...m,status:newValue}:m
));

await supabase
.from("media")
.update({status:newValue})
.eq("id",item.id);

}



/* LINKS */

const uploadLink=
event?`${window.location.origin}/upload/${event.event_code}`:"";

const galleryLink=
event?`${window.location.origin}/gallery/${event.event_code}`:"";



/* GROUP */

const folders=useMemo(()=>groupFolders(media),[media]);

const archive=media.filter(m=>m.archived);



/* STATS */

const totalPhotos=
media.filter(m=>m.file_url.match(/\.(jpg|jpeg|png|webp)$/i)).length;

const totalVideos=
media.filter(m=>m.file_url.match(/\.(mp4|mov|webm)$/i)).length;

const totalStorage=formatBytes(
media.reduce((sum,m)=>sum+Number(m.bytes||0),0)
);



/* GALLERY */

async function toggleGallery(){

if(!event)return;

const newValue=!event.gallery_enabled;

await supabase
.from("events")
.update({gallery_enabled:newValue})
.eq("id",event.id);

setEvent({...event,gallery_enabled:newValue});

}



if(loading)
return <main className="p-10">Loading...</main>;

if(!event)
return <main className="p-10">Not found</main>;



return(

<main className="max-w-6xl mx-auto px-4 py-5 space-y-4">



{/* HERO WITH STATS INSIDE */}

<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-5 py-4">

<div className="flex justify-between items-start">

<div>

<div className="text-2xl font-semibold">
{event.name}
</div>

<div className="text-white/50 text-sm">
Hosted by {event.host_name}
</div>

</div>

<div className="text-right text-xs text-white/60 space-y-1">

<div>{totalPhotos} Photos</div>
<div>{totalVideos} Videos</div>
<div>{totalStorage}</div>

</div>

</div>

</div>



{/* CONTROLS SIDE BY SIDE EVEN ON MOBILE */}

<div className="grid grid-cols-2 gap-3">


<ControlCard title="Upload">

<ControlButton
label="Copy Link"
onClick={()=>navigator.clipboard.writeText(uploadLink)}
/>

<ControlButton
label="Share"
onClick={()=>shareLink(uploadLink)}
/>

<ControlButton
label="QR Poster"
onClick={()=>{
setQr(uploadLink);
setQrTitle("Upload Photos");
}}
/>

</ControlCard>



<ControlCard title="Gallery">

<ControlButton
label="Copy Link"
onClick={()=>navigator.clipboard.writeText(galleryLink)}
/>

<ControlButton
label={event.gallery_enabled?"Disable":"Enable"}
onClick={toggleGallery}
/>

</ControlCard>



</div>



{/* FOLDERS */}

<SectionCard title="Guest Upload Folders">

<div className="space-y-3">

{Object.entries(folders).map(([key,items]:any)=>(

<Folder
key={key}
name={key}
items={items}
open={openFolders[key]}
setOpen={(v:boolean)=>setOpenFolders(prev=>({...prev,[key]:v}))}
onArchive={updateArchive}
onApprove={updateApprove}
isArchive={false}
/>

))}

</div>

</SectionCard>



{/* ARCHIVE */}

{archive.length>0&&(

<SectionCard title="Archive">

<Folder
name="Archived Media"
items={archive}
open={openFolders.archive}
setOpen={(v:boolean)=>setOpenFolders(prev=>({...prev,archive:v}))}
onArchive={updateArchive}
onApprove={updateApprove}
isArchive={true}
/>

</SectionCard>

)}



{/* QR */}

{qr&&(

<QRModal
link={qr}
title={qrTitle}
event={event.name}
onClose={()=>setQr(null)}
/>

)}



</main>

);

}



/* CONTROL CARD */

function ControlCard({title,children}:any){

return(

<div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">

<div className="text-xs text-white/50">
{title}
</div>

{children}

</div>

);

}



/* BUTTON */

function ControlButton({label,onClick}:any){

return(

<button
onClick={onClick}
className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] text-sm hover:bg-white/[0.08]"
>
{label}
</button>

);

}



/* SECTION */

function SectionCard({title,children}:any){

return(

<div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4 space-y-3">

<div className="text-sm text-white/60">
{title}
</div>

{children}

</div>

);

}



/* SHARE */

function shareLink(link:string){

if(navigator.share){
navigator.share({url:link});
}else{
window.open(`https://wa.me/?text=${encodeURIComponent(link)}`);
}

}



/* QR */

function QRModal({link,title,event,onClose}:any){

return(

<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>

<div className="bg-white p-8 rounded-2xl space-y-4" onClick={e=>e.stopPropagation()}>

<QRCode id="eventqr" value={link} size={240}/>

<div className="text-black text-center">
{title}
</div>

<button
onClick={()=>downloadPoster(link,title,event)}
className="bg-black text-white w-full py-2 rounded-xl"
>
Download Poster
</button>

</div>

</div>

);

}



/* POSTER */

function downloadPoster(link:string,action:string,eventName:string){

const canvas=document.createElement("canvas");
canvas.width=800;
canvas.height=1000;

const ctx=canvas.getContext("2d");
if(!ctx)return;

ctx.fillStyle="#fff";
ctx.fillRect(0,0,800,1000);

ctx.fillStyle="#000";
ctx.font="bold 42px sans-serif";
ctx.fillText("PhotoBox",260,120);

ctx.font="26px sans-serif";
ctx.fillText(eventName,200,180);

const qrCanvas=document.getElementById("eventqr")?.querySelector("canvas");

if(qrCanvas){
ctx.drawImage(qrCanvas,200,240,400,400);
}

ctx.font="24px sans-serif";
ctx.fillText(action,280,700);

const linkEl=document.createElement("a");
linkEl.download="photobox-poster.png";
linkEl.href=canvas.toDataURL();
linkEl.click();

}



/* FOLDER */

function Folder({name,items,open,setOpen,onArchive,onApprove,isArchive}:any){

const photos=items.filter((i:any)=>i.file_url.match(/\.(jpg|jpeg|png|webp)$/i)).length;
const videos=items.filter((i:any)=>i.file_url.match(/\.(mp4|mov|webm)$/i)).length;
const storage=formatBytes(items.reduce((sum:any,i:any)=>sum+Number(i.bytes||0),0));

return(

<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">

<div onClick={()=>setOpen(!open)} className="cursor-pointer flex justify-between">

<div>

<div>{name}</div>

<div className="text-white/40 text-sm">
{photos} • {videos} • {storage}
</div>

</div>

<div>{open?"−":"+"}</div>

</div>

{open&&(

<div className="grid grid-cols-2 gap-3 mt-3">

{items.map((item:any)=>(

<Tile key={item.id} item={item} onArchive={onArchive} onApprove={onApprove} showApprove={!isArchive}/>

))}

</div>

)}

</div>

);

}



function Tile({item,onArchive,onApprove,showApprove}:any){

return(

<div className="relative aspect-square rounded-xl overflow-hidden">

<Image src={item.file_url} alt="" fill className="object-cover"/>

<div className="absolute bottom-2 left-2 right-2 flex justify-between">

{showApprove&&(
<MiniToggle label="Approve" enabled={item.status==="approved"} onClick={()=>onApprove(item)}/>
)}

<MiniToggle label="Archive" enabled={item.archived} onClick={()=>onArchive(item)}/>

</div>

</div>

);

}



function MiniToggle({label,enabled,onClick}:any){

return(

<div onClick={(e)=>{e.stopPropagation();onClick();}} className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full">

<div className="text-[10px]">{label}</div>

<div className={`w-7 h-4 rounded-full ${enabled?"bg-yellow-400":"bg-gray-500"}`}>

<div className={`w-3 h-3 bg-black rounded-full mt-[2px] ${enabled?"ml-4":"ml-1"}`}/>

</div>

</div>

);

}



function formatBytes(bytes:number){

if(!bytes)return"0 MB";

const sizes=["B","KB","MB","GB"];
const i=Math.floor(Math.log(bytes)/Math.log(1024));

return((bytes/Math.pow(1024,i)).toFixed(1)+" "+sizes[i]);

}



function groupFolders(media:Media[]){

const result:any={};

media.filter(m=>!m.archived).forEach(m=>{

const key=m.uploader_name+"_"+m.uploader_phone;

if(!result[key])result[key]=[];

result[key].push(m);

});

return result;

}