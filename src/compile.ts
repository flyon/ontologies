import { ModuleResolutionKind } from "ts-morph"
import ts, { ModuleKind } from "typescript"

import tsconfig from "../tsconfig.json"

import { packageFolder, packageTSIndexFile } from './helpers'
import { Package } from './types';

export const compile = (ontologies: Package[]): Package[] => {
  for (const ontology of ontologies) {
    console.log(`Compiling ${ontology.info.name}`);
    const program = ts.createProgram(
      [packageTSIndexFile(ontology)],
      {
        ...tsconfig.compilerOptions as unknown as ts.CompilerOptions,
        noEmit: false,
        module: ModuleKind.ES2015,
        moduleResolution: ModuleResolutionKind.NodeJs,
        declaration: true,
      }
    )
    program.emit()

    const cjsProgram = ts.createProgram(
      [packageTSIndexFile(ontology)],
      {
        ...tsconfig.compilerOptions as unknown as ts.CompilerOptions,
        noEmit: false,
        module: ModuleKind.CommonJS,
        moduleResolution: ModuleResolutionKind.NodeJs,
        declaration: false,
        outDir: `${packageFolder(ontology)}/cjs/`
      }
    )
    cjsProgram.emit()
  }

  return ontologies
}
