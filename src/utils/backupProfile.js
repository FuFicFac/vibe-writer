import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import TurndownService from 'turndown';

// Initialize Turndown to convert HTML back to Markdown
const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced'
});

export const backupProfileToZip = async (profileId, profiles, projects, folders, documents) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) throw new Error("Profile not found for backup");

    const zip = new JSZip();
    const profileNameSafe = profile.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const dateStr = new Date().toISOString().split('T')[0];
    const zipFileName = `${profileNameSafe}_vibe_writer_backup_${dateStr}.zip`;

    const profileProjects = projects.filter(p => p.profileId === profileId || (!p.profileId && profileId === profiles[0]?.id));

    if (profileProjects.length === 0) {
        // Just an empty zip if no projects, or throw an error.
        zip.file("readme.txt", "No projects found in this profile.");
    }

    profileProjects.forEach((project, projectIndex) => {
        const projectFolderName = project.name.replace(/[^a-z0-9 \-_]/gi, '').trim() || `Project_${projectIndex + 1}`;
        const projectZipFolder = zip.folder(projectFolderName);

        const projFolders = folders.filter(f => f.projectId === project.id).sort((a, b) => a.order - b.order);

        // Put documents that aren't in any folder (if any exist) in the root of the project
        const rootDocs = documents.filter(d => !d.folderId && d.projectId === project.id);
        rootDocs.forEach((doc, docIndex) => {
            const docNameSafe = doc.name.replace(/[^a-z0-9 \-_]/gi, '').trim() || `Untitled_${docIndex + 1}`;
            const markdownContent = doc.content ? turndownService.turndown(doc.content) : '';
            projectZipFolder.file(`${docNameSafe}.md`, markdownContent || '*(Empty Document)*');
        });

        // Loop through folders and put their documents inside
        projFolders.forEach((folder, folderIndex) => {
            const safeFolderName = folder.name.replace(/[^a-z0-9 \-_]/gi, '').trim() || `Folder_${folderIndex + 1}`;
            const subZipFolder = projectZipFolder.folder(safeFolderName);

            const folderDocs = documents.filter(d => d.folderId === folder.id).sort((a, b) => a.order - b.order);

            if (folderDocs.length === 0) {
                subZipFolder.file(".empty", ""); // Keep the empty folder
            }

            folderDocs.forEach((doc, docIndex) => {
                const docNameSafe = doc.name.replace(/[^a-z0-9 \-_]/gi, '').trim() || `Untitled_${docIndex + 1}`;
                const markdownContent = doc.content ? turndownService.turndown(doc.content) : '';
                subZipFolder.file(`${docNameSafe}.md`, markdownContent || '*(Empty Document)*');
            });
        });
    });

    try {
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, zipFileName);
        return true;
    } catch (error) {
        console.error("Failed to generate zip file:", error);
        return false;
    }
};
