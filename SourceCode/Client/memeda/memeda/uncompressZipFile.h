//
//  uncompressZipFile.h
//  memeda
//
//  Created by Lee Justin on 13-9-4.
//
//

#ifndef __memeda__uncompressZipFile__
#define __memeda__uncompressZipFile__

#include <iostream>

bool uncompressZipFile(std::string _storagePath, std::string zipPath, std::string desDir);

//解压单元测试
void testUnzipFiles();

#endif /* defined(__memeda__uncompressZipFile__) */
