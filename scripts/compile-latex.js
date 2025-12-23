import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const projectRoot = process.cwd();

const documents = [
    {
        name: 'Deterministic Skip-Bo HPVP Agent Analysis',
        root: 'Deterministic_SkipBo_HPVP_Agent_Analysis.tex',
        compiler: 'pdflatex',
        cwd: 'docs/thesis'
    },
    {
        name: 'MIT Thesis Layout',
        root: 'skipbo_mit_layout.tex',
        compiler: 'lualatex',
        cwd: 'docs/thesis'
    }
];

function compile(doc) {
    console.log(`\n--- Compiling: ${doc.name} ---`);
    const fullCwd = path.join(projectRoot, doc.cwd);

    try {
        // Run compiler (usually twice to resolve references)
        console.log(`Running ${doc.compiler}...`);
        execSync(`${doc.compiler} -interaction=nonstopmode ${doc.root}`, {
            cwd: fullCwd,
            stdio: 'inherit'
        });

        console.log(`Running ${doc.compiler} (second pass)...`);
        execSync(`${doc.compiler} -interaction=nonstopmode ${doc.root}`, {
            cwd: fullCwd,
            stdio: 'inherit'
        });

        console.log(`Success! PDF generated for ${doc.name}`);

        // Sync with public/documents for the website
        const pdfName = doc.root.replace('.tex', '.pdf');
        const sourcePdf = path.join(fullCwd, pdfName);
        const destPdf = path.join(projectRoot, 'public/documents', pdfName);

        if (fs.existsSync(sourcePdf)) {
            fs.copyFileSync(sourcePdf, destPdf);
            console.log(`Synced ${pdfName} to public/documents/`);
        }
    } catch (error) {
        console.error(`Error compiling ${doc.name}: ${error.message}`);
    }
}

documents.forEach(compile);
