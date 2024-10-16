"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import React from "react"

export function TattooDesignFormComponent() {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Customize Your Tattoo Design</CardTitle>
          <CardDescription>Fill in the details to generate your perfect tattoo design.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Tattoo Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your desired tattoo in detail..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select required>
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traditional">Traditional</SelectItem>
                    <SelectItem value="realism">Realism</SelectItem>
                    <SelectItem value="watercolor">Watercolor</SelectItem>
                    <SelectItem value="tribal">Tribal</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select required>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (2-4 inches)</SelectItem>
                    <SelectItem value="medium">Medium (4-6 inches)</SelectItem>
                    <SelectItem value="large">Large (6-8 inches)</SelectItem>
                    <SelectItem value="extra-large">Extra Large (8+ inches)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select required>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black-and-gray">Black and Gray</SelectItem>
                    <SelectItem value="full-color">Full Color</SelectItem>
                    <SelectItem value="black-work">Black Work</SelectItem>
                    <SelectItem value="red-ink">Red Ink</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placement">Placement</Label>
                <Select required>
                  <SelectTrigger id="placement">
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arm">Arm</SelectItem>
                    <SelectItem value="leg">Leg</SelectItem>
                    <SelectItem value="back">Back</SelectItem>
                    <SelectItem value="chest">Chest</SelectItem>
                    <SelectItem value="shoulder">Shoulder</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference-images">Reference Images</Label>
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="reference-images"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <Input
                    id="reference-images"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                  />
                </Label>
              </div>
              {files.length > 0 && (
                <p className="text-sm text-gray-500">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Generate Tattoo Design
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}