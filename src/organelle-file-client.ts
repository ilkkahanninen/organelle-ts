import fetch, { RequestInit } from "node-fetch"
import { promisify } from "util"
import fs from "fs"
import FormData from "form-data"
import { basename } from "path"

type FSNode = {
  children: boolean
  name: string
  path: string
  type: "folder" | "file"
}

const readFile = promisify(fs.readFile)

export const createOrganelleFileClient = (deviceAddress: string) => {
  const call = async <T extends object>(
    path: string,
    query?: object,
    options?: RequestInit
  ): Promise<T> => {
    const q = query
      ? "?" +
        Object.entries(query)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&")
      : ""
    const url = `http://${deviceAddress}${path}${q}`
    const response = await fetch(url, options)
    const responseData = await response.text()
    return JSON.parse(responseData)
  }

  const getNodes = (path: string) =>
    call<FSNode[]>("/files/fmdata", {
      operation: "get_node",
      path
    })

  const createFolder = (parentDir: string, name: string) =>
    call("/files/fmdata", {
      operation: "create_node",
      path: parentDir,
      name: name
    })

  const deleteNode = (path: string) =>
    call("/files/fmdata", {
      operation: "delete_node",
      path
    })

  const createFolderIfNotExists = async (parentDir: string, name: string) => {
    const nodes = await getNodes(parentDir)
    if (nodes.find(n => n.name === name) === undefined) {
      await createFolder(parentDir, name)
    }
  }

  const createPath = async (path: string) => {
    const parts = path.split("/")
    let parent = `/${parts.shift()}`
    for (let part of parts) {
      await createFolderIfNotExists(parent, part)
      parent += `/${part}`
    }
  }

  const upload = async (path: string, filename: string) => {
    const form = new FormData()
    form.append(
      "dst",
      path
        .split("/")
        .filter(n => n)
        .join("/") + "/"
    )
    form.append("files[]", await readFile(filename), { filename })

    await call("/files/upload", undefined, {
      method: "POST",
      headers: form.getHeaders(),
      body: form
    })
  }

  const uploadFiles = async (path: string, filenames: string[]) => {
    const basenames = filenames.map(name => basename(name))
    const existingNodes = (await getNodes(path)).filter(node =>
      basenames.includes(node.name)
    )

    for (let node of existingNodes) {
      await deleteNode(`${path}/${node.name}`)
    }

    for (let filename of filenames) {
      await upload(path, filename)
    }
  }

  return {
    createPath,
    uploadFiles
  }
}
